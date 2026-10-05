// Typed index for the nspawn-boundary research DB.
// Shapes mirror research-db/archive.json and research-db/digs/*.json exactly.

export interface DugResult {
  query: string;
  title: string;
  url: string;
  content: string;
  weight: number | null;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: DugResult[];
}

export interface ArchiveEntry {
  query: string;
  title: string;
  url: string;
  snippet: string;
  weight: number | null;
  collected_at: string;
}
