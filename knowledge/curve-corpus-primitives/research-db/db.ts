export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: "high" | "low" | null;
  collected_at: string;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: DugResult[];
}

export interface ArchiveEntry extends DugResult {
  subtopic: string;
  jevAnswer?: number | null;
}
