export type ApolloEnrichmentRequest = {
  domain?: string;
  businessEmail?: string;
  organizationName?: string;
  correlationId: string;
};

export type ApolloPersonPreview = {
  fullName?: string;
  title?: string;
  organizationName?: string;
};

export type ApolloProvenance = {
  provider: 'apollo';
  enriched: false;
};
