// Typed index for the container-isolation-adjacent-problems research DB.

export interface DugResult {
  /** searXNG query the result came from */
  query: string;
  /** result title */
  title: string;
  /** result URL */
  url: string;
  /** trimmed content snippet from searXNG */
  snippet: string;
  /** jev weight: "high" (noul >= 0.5), "low" (noul < 0.5), or "unweighted" */
  weight: string;
  /** ISO 8601 UTC collection time */
  collected_at: string;
  /** raw jev noul probability, present when weighted */
  jev_answer?: number;
}

export interface DigRecord {
  /** subtopic slug, matches the NN-<slug>.md doc name */
  subtopic: string;
  /** the 2 seed queries for this subtopic */
  queries: string[];
  /** number of dig redos performed (0 in this corpus) */
  redo_count: number;
  /** results kept per query */
  results_kept: { query: string; title: string; url: string }[];
}

export interface ArchiveEntry extends DugResult {}

export const JEVA_STATS = {
  outlineValidationRequests: 1,
  weightingRequests: 20,
  jevRetries: 1, // single 429 on batch 12, recovered after 30s backoff
  resultsWeighted: 96,
  highWeight: 40,
  lowWeight: 56,
  unweighted: 0,
} as const;
