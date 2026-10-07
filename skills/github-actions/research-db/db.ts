// research-db schema v2 for the skills/github-actions corpus (yubi-OS/knowledge).
// File -> interface mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[] (JSON array)
//   research-db/digs/*.json    -> DigRecord (one per doc)
//   research-db/jev-log.json   -> JevLogEntry[] (JSON array)

// research-db/preflight.json
export interface PreflightRecord {
  date: string; // "2026-10-06"
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    note: string;
  };
}

// research-db/outline.json
export interface OutlineRecord {
  topic: string;
  ground_source: string; // yubi-OS/yubiOS skills/github-actions/SKILL.md
  subtopics: {
    nn: string; // renumbered kept order, "01".."07"
    orig: string; // original t01..t09 outline id
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  dropped_subtopics: {
    nn: string;
    orig: string;
    slug: string;
    scope: string;
    seed_queries: string[];
    score: number;
    reason: string;
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[]; // orig ids
    kept: string[]; // orig ids
  };
}

// One collected search result with its noul decision. research-db/archive.json is DugResult[].
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // the noul probability; >= 0.5 counts as authoritative
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry, if rescored
}

// research-db/archive.json[*].decision
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object returned by the decision model
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

// research-db/digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // e.g. "internal-record subtopic, no dig"
}

// research-db/jev-log.json is JevLogEntry[]
export interface JevLogEntry {
  requested_at: string; // ISO 8601 UTC
  endpoint: string; // actual endpoint used (DefAPI direct or worker fallback)
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number };
}
