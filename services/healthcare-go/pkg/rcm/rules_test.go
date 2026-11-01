package rcm

import (
	"strings"
	"testing"
)

func TestValidASCSurgicalBundlingWithDistinctModifier(t *testing.T) {
	result, err := ValidateClaimEdits(ClaimEditRequest{
		ClaimID: "SYN-ASC-001",
		Lines: []ClaimLine{
			{CPT: "29881", FeeCents: 120000},
			{CPT: "29877", Modifiers: []string{"59"}, FeeCents: 40000},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Accepted {
		t.Fatalf("expected accepted claim with -59, got recommendations: %+v", result.Recommendations)
	}
	if len(result.MPPRAdjustments) != 1 {
		t.Fatalf("expected one MPPR adjustment, got %d", len(result.MPPRAdjustments))
	}
	if result.MPPRAdjustments[0].AdjustedFeeCents != 20000 {
		t.Fatalf("expected MPPR half of 40000, got %d", result.MPPRAdjustments[0].AdjustedFeeCents)
	}
}

func TestUnbundledCPTWithoutModifierRejected(t *testing.T) {
	result, err := ValidateClaimEdits(ClaimEditRequest{
		ClaimID: "SYN-ASC-002",
		Lines: []ClaimLine{
			{CPT: "29881", FeeCents: 120000},
			{CPT: "29877", FeeCents: 40000},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Accepted {
		t.Fatal("expected unbundled pair without -59 to be rejected")
	}
	found := false
	for _, rec := range result.Recommendations {
		if rec.Code == "ASC_UNBUNDLED_CPT" {
			found = true
			if !contains(rec.Message, "Modifier -59") {
				t.Fatalf("expected -59 guidance, got %q", rec.Message)
			}
		}
	}
	if !found {
		t.Fatal("missing ASC_UNBUNDLED_CPT recommendation")
	}
}

func contains(s, substr string) bool {
	return strings.Contains(s, substr)
}

func TestBilateralModifierAgainstDisallowedCode(t *testing.T) {
	result, err := ValidateClaimEdits(ClaimEditRequest{
		ClaimID: "SYN-ASC-003",
		Lines: []ClaimLine{
			{CPT: "45378", Modifiers: []string{"50"}, FeeCents: 90000},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Accepted {
		t.Fatal("expected bilateral -50 on disallowed anatomical code to fail")
	}
}

func TestBilateralAllowedAnatomicalSet(t *testing.T) {
	result, err := ValidateClaimEdits(ClaimEditRequest{
		ClaimID: "SYN-ASC-004",
		Lines: []ClaimLine{
			{CPT: "29881", Modifiers: []string{"-50"}, FeeCents: 110000},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.Accepted {
		t.Fatalf("29881 is in bilateral-allowed set; got %+v", result.Recommendations)
	}
}

func TestRejectPHIFieldPresence(t *testing.T) {
	cases := []map[string]any{
		{"claimId": "SYN", "ssn": "***-**-****", "lines": []any{}},
		{"claimId": "SYN", "dob": "REDACTED", "lines": []any{}},
		{"claimId": "SYN", "patientName": "REDACTED", "lines": []any{}},
		{"claimId": "SYN", "patient": map[string]any{"name": "REDACTED"}, "lines": []any{}},
	}
	for i, raw := range cases {
		err := RejectPHI(raw)
		if err == nil {
			t.Fatalf("case %d: expected PHI rejection", i)
		}
		if err.Error() != "PHI prohibited on edge service" {
			t.Fatalf("case %d: unexpected message %q", i, err.Error())
		}
	}
}

func TestAllowSyntheticClaimWithoutPHIKeys(t *testing.T) {
	raw := map[string]any{
		"claimId": "SYN-ASC-SAFE",
		"lines": []any{
			map[string]any{"cpt": "29881", "feeCents": 120000},
		},
	}
	if err := RejectPHI(raw); err != nil {
		t.Fatalf("unexpected PHI rejection: %v", err)
	}
}
