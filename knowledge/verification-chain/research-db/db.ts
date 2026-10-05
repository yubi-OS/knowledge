// Research DB index for the verification-chain corpus mint.
// Shapes mirror archive.json and digs-all.json exactly.

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
}

export interface ArchiveEntry extends DugResult {
  weight: 'high' | 'low';
  collected_at: string;
  jev_noul: number | null;
}

export interface DigRecord {
  subtopic: string;
  queries: string[];
  redo_count: number;
  results_kept: number;
}
