export interface DugResult {
  subtopic: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: number | null;
  jev_answer: number | null;
  collected_at: string;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  redo_queries?: { redo1: string[]; redo2: string[] };
  results_kept: number;
}

export interface ArchiveEntry extends DugResult {}
