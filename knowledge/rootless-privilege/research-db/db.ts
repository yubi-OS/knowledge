// Typed index for the rootless-privilege research DB.

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: number | null;
  collected_at: string;
  jev_answer?: number | null;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: number;
  outline_validation?: number;
}

export interface ArchiveEntry extends DugResult {}
