// research-db/db.ts : TypeScript interfaces matching the research-db shapes.
// File -> interface map:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (each carries a DecisionRecord)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}

export interface OutlineSubtopic {
  nn: string;      // 01..10 outline order
  slug: string;
  scope: string;
  seed_queries: string[]; // empty for internal-record subtopics (no dig)
}

export interface OutlineAnswer { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string>; }
export interface OutlineUsage { input_tokens: number; output_tokens: number; }
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: { metric: string; criteria: string[]; model: string; answers: Record<string, OutlineAnswer>; usage: OutlineUsage; dropped: string[]; kept: string[] };
}

export interface DecisionRecord {
  type: string;            // "noul"
  instructions: string;
  model: string;           // metric family label per schema ("clef")
  endpoint?: string;       // actual HTTP endpoint used (DefAPI direct)
  answer: object;          // raw answer object as returned
  usage: { input_tokens: number | null; output_tokens: number | null }; // batch-level usage is recorded per request in jev-log.json; null here by design
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;   // = answer.noul probability; null only for unscored entries
  decision: DecisionRecord;
  redo_of: number | null;  // index of superseded entry when a result was rescored; null here (redos were new queries, not rescores)
}

export interface DigQueryAttempt { query: string; attempt: number; raw_results: number; kept: number; }
export interface DigRecord {
  nn: string; slug: string; scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;           // "internal-record subtopic, no dig" for no-dig subtopics
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
  note?: string;
}
