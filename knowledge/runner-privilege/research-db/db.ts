// Typed index for the runner-privilege research DB.

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: number;
  collected_at: string;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: number;
}

export interface ArchiveEntry extends DugResult {}

export interface OutlineValidation {
  ref: string;
  validated_at: string;
  model: string;
  answers: Record<string, number>;
  kept: string[];
  dropped: string[];
}
