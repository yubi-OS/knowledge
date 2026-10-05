// Typed index for the 0pointer-poettering-systemd-vision research DB.
// Shapes match archive.json and digs_index.json in this directory.

/** One collected search result, as stored in archive.json. */
export interface ArchiveEntry {
  /** searXNG query that produced the result */
  query: string;
  /** result title */
  title: string;
  /** result URL */
  url: string;
  /** content snippet from searXNG, truncated to 400 chars */
  snippet: string;
  /** jev noul probability 0..1; null when weighting failed before this result was reached */
  weight: number | null;
  /** ISO 8601 UTC collection timestamp */
  collected_at: string;
  /** subtopic slug the result was dug for */
  subtopic: string;
  /** true when the row came from a redo dig */
  redo?: boolean;
}

/** Per-subtopic dig record, as stored in digs_index.json. */
export interface DigRecord {
  /** subtopic slug (doc number prefix maps to outline order) */
  subtopic: string;
  /** outline subtopic id (t01..t10) */
  id: string;
  /** the seed queries run against searXNG */
  queries: string[];
  /** number of redo digs performed (0 = first dig sufficed) */
  redo_count: number;
  /** queries used only in the redo dig, present when redo_count > 0 */
  redo_queries?: string[];
  /** results with jev weight >= 0.5, deduplicated per subtopic */
  results_kept: DugResult[];
}

/** A high-weight result worth citing, keyed by title/url/weight. */
export interface DugResult {
  title: string;
  url: string;
  /** jev noul probability 0..1 */
  weight: number;
}

/** Outline validation record, as stored in outline.json. */
export interface OutlineValidation {
  endpoint: string;
  model: string;
  jev_requests_used: number;
  answers: Record<string, number>;
  dropped: string[];
}

/** Full corpus-level index entry. */
export interface CorpusIndex {
  ref: string;
  topic: string;
  outline_validation: OutlineValidation;
  subtopics: Array<{
    id: string;
    slug: string;
    scope: string;
    queries: string[];
  }>;
}
