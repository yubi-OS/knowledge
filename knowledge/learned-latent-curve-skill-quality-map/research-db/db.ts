// research-db/db.ts - TypeScript interfaces matching every shape stored in this
// research-db directory. Comment on each interface maps it to its file.
//
// File -> interface map:
//   preflight.json      -> PreflightRecord
//   outline.json        -> OutlineRecord
//   archive.json        -> DugResult[] (one entry per collected searXNG result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json        -> JevLogEntry[]

// preflight.json: connectivity probe of the two mint services on the mint date.
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: object;
  };
}

// outline.json: topic decomposition plus the full jev outline-validation record.
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

// One entry of archive.json: a collected searXNG result and its noul decision.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

// The full record of one decision-model call stored on the result it scored.
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: object;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

// digs/<NN>-<slug>.json: the dig history for one subtopic doc.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// One entry of jev-log.json: one HTTP request to /api/decide.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
