// Typed index for the mirror-provenance research DB.

export interface DugResult {
  qid: string;
  title: string;
  url: string;
  snippet: string;
  /** jev noul probability, 0..1; null when the result was never weighted */
  weight: number | null;
  /** searXNG query ids whose top-6 cut included this result */
  queries: string[];
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: number;
}

export interface ArchiveEntry {
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: number | null;
  collected_at: string;
  /** jev noul >= 0.4, null when unweighted */
  jev_answer: boolean | null;
}
