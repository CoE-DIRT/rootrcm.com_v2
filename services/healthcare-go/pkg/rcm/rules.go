// Package rcm implements PHI-free ASC claim-edit validation helpers.
// Inputs must never include patient identifiers. Only synthetic CPT lines are accepted.
package rcm

import (
	"fmt"
	"sort"
	"strings"
)

// ClaimLine is a synthetic surgical service line. No patient fields are permitted upstream.
type ClaimLine struct {
	CPT       string   `json:"cpt"`
	Modifiers []string `json:"modifiers,omitempty"`
	Units     int      `json:"units,omitempty"`
	FeeCents  int      `json:"feeCents,omitempty"`
}

// ClaimEditRequest is the edge payload for claim-edit validation.
type ClaimEditRequest struct {
	ClaimID string      `json:"claimId"`
	Lines   []ClaimLine `json:"lines"`
}

// EditRecommendation describes a deterministic coding suggestion.
type EditRecommendation struct {
	Code    string `json:"code"`
	Severity string `json:"severity"`
	Message string `json:"message"`
}

// ClaimEditResult is the validation response for a synthetic claim.
type ClaimEditResult struct {
	ClaimID         string               `json:"claimId"`
	Accepted        bool                 `json:"accepted"`
	Recommendations []EditRecommendation `json:"recommendations"`
	MPPRAdjustments []MPPRAdjustment     `json:"mpprAdjustments,omitempty"`
}

// MPPRAdjustment records a 50% subordinate surgical discount.
type MPPRAdjustment struct {
	CPT              string `json:"cpt"`
	OriginalFeeCents int    `json:"originalFeeCents"`
	AdjustedFeeCents int    `json:"adjustedFeeCents"`
	Rule             string `json:"rule"`
}

// Known unbundled pairs: component CPT should not be billed with the comprehensive CPT
// in the same ASC encounter without an appropriate distinct-procedure modifier.
var unbundlePairs = map[string]string{
	"29877": "29881", // chondroplasty often bundled into meniscectomy (same compartment)
	"29874": "29881",
	"29875": "29880",
}

// Anatomical codes that may accept bilateral reporting via modifier 50 on professional claims.
// ASC facility claims typically prefer RT/LT or units=2; this edge check flags misuse.
var bilateralAllowed = map[string]bool{
	"29880": true,
	"29881": true,
	"27447": true,
	"64721": true,
}

// PHIProhibitedError is returned when the payload includes forbidden patient fields.
type PHIProhibitedError struct{}

func (e PHIProhibitedError) Error() string {
	return "PHI prohibited on edge service"
}

// RejectPHI inspects a raw JSON object map for patient-identifying keys.
// Synthetic placeholder values are still rejected — field presence alone is enough.
func RejectPHI(raw map[string]any) error {
	forbidden := []string{"patientName", "patient_name", "ssn", "dob", "dateOfBirth", "date_of_birth"}
	for _, key := range forbidden {
		if _, ok := raw[key]; ok {
			return PHIProhibitedError{}
		}
		// Nested patient object
		if patient, ok := raw["patient"].(map[string]any); ok {
			for _, nested := range []string{"name", "ssn", "dob", "dateOfBirth"} {
				if _, present := patient[nested]; present {
					return PHIProhibitedError{}
				}
			}
		}
	}
	return nil
}

// ValidateClaimEdits applies ASC unbundling, bilateral modifier, and MPPR checks.
func ValidateClaimEdits(req ClaimEditRequest) (ClaimEditResult, error) {
	result := ClaimEditResult{
		ClaimID:         strings.TrimSpace(req.ClaimID),
		Accepted:        true,
		Recommendations: nil,
	}
	if result.ClaimID == "" {
		result.ClaimID = "SYNTHETIC-CLAIM"
	}
	if len(req.Lines) == 0 {
		return result, fmt.Errorf("at least one claim line is required")
	}

	present := map[string]ClaimLine{}
	for _, line := range req.Lines {
		cpt := strings.TrimSpace(line.CPT)
		if cpt == "" {
			return result, fmt.Errorf("cpt is required on every line")
		}
		mods := normalizeModifiers(line.Modifiers)
		units := line.Units
		if units <= 0 {
			units = 1
		}
		present[cpt] = ClaimLine{CPT: cpt, Modifiers: mods, Units: units, FeeCents: line.FeeCents}

		if hasModifier(mods, "50") && !bilateralAllowed[cpt] {
			result.Accepted = false
			result.Recommendations = append(result.Recommendations, EditRecommendation{
				Code:     "ASC_BILATERAL_50",
				Severity: "error",
				Message:  fmt.Sprintf("Modifier -50 is not allowed for CPT %s; use RT/LT or anatomical code sets that permit bilateral billing", cpt),
			})
		} else if hasModifier(mods, "50") && bilateralAllowed[cpt] {
			result.Recommendations = append(result.Recommendations, EditRecommendation{
				Code:     "ASC_BILATERAL_HINT",
				Severity: "warning",
				Message:  fmt.Sprintf("CPT %s with -50: ASC facility claims often report RT/LT or units=2 instead of modifier -50", cpt),
			})
		}
	}

	for component, comprehensive := range unbundlePairs {
		if _, hasComponent := present[component]; !hasComponent {
			continue
		}
		if _, hasComprehensive := present[comprehensive]; !hasComprehensive {
			continue
		}
		compMods := present[component].Modifiers
		if hasModifier(compMods, "59") || hasModifier(compMods, "XS") || hasModifier(compMods, "XE") {
			result.Recommendations = append(result.Recommendations, EditRecommendation{
				Code:     "ASC_UNBUNDLE_REVIEW",
				Severity: "info",
				Message:  fmt.Sprintf("CPT %s billed with %s using a distinct-procedure modifier — verify same-compartment unbundling guidelines", component, comprehensive),
			})
			continue
		}
		result.Accepted = false
		result.Recommendations = append(result.Recommendations, EditRecommendation{
			Code:     "ASC_UNBUNDLED_CPT",
			Severity: "error",
			Message:  fmt.Sprintf("CPT %s is typically bundled into %s; add Modifier -59 / check payer unbundling guidelines or remove the component code", component, comprehensive),
		})
	}

	result.MPPRAdjustments = applyMPPR(req.Lines)
	for _, adj := range result.MPPRAdjustments {
		result.Recommendations = append(result.Recommendations, EditRecommendation{
			Code:     "ASC_MPPR_50",
			Severity: "info",
			Message:  fmt.Sprintf("MPPR 50%% discount applied to subordinate surgical CPT %s (%d → %d cents)", adj.CPT, adj.OriginalFeeCents, adj.AdjustedFeeCents),
		})
	}

	return result, nil
}

func normalizeModifiers(mods []string) []string {
	out := make([]string, 0, len(mods))
	for _, m := range mods {
		m = strings.ToUpper(strings.TrimSpace(strings.TrimPrefix(m, "-")))
		if m != "" {
			out = append(out, m)
		}
	}
	return out
}

func hasModifier(mods []string, want string) bool {
	want = strings.ToUpper(want)
	for _, m := range mods {
		if m == want {
			return true
		}
	}
	return false
}

func applyMPPR(lines []ClaimLine) []MPPRAdjustment {
	type ranked struct {
		cpt  string
		fee  int
		idx  int
	}
	var surgical []ranked
	for i, line := range lines {
		fee := line.FeeCents
		if fee <= 0 {
			continue
		}
		cpt := strings.TrimSpace(line.CPT)
		if !isSurgicalCPT(cpt) {
			continue
		}
		surgical = append(surgical, ranked{cpt: cpt, fee: fee, idx: i})
	}
	if len(surgical) < 2 {
		return nil
	}
	sort.SliceStable(surgical, func(i, j int) bool {
		if surgical[i].fee == surgical[j].fee {
			return surgical[i].idx < surgical[j].idx
		}
		return surgical[i].fee > surgical[j].fee
	})
	var adjustments []MPPRAdjustment
	for _, line := range surgical[1:] {
		adjustments = append(adjustments, MPPRAdjustment{
			CPT:              line.cpt,
			OriginalFeeCents: line.fee,
			AdjustedFeeCents: line.fee / 2,
			Rule:             "MPPR_50_SUBORDINATE_SURGICAL",
		})
	}
	return adjustments
}

func isSurgicalCPT(cpt string) bool {
	if len(cpt) != 5 {
		return false
	}
	for _, ch := range cpt {
		if ch < '0' || ch > '9' {
			return false
		}
	}
	// CPT surgical range roughly 10000–69999
	return cpt >= "10000" && cpt <= "69999"
}
