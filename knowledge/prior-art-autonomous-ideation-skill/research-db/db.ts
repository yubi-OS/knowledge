// research-db TypeScript interfaces for knowledge/prior-art-autonomous-ideation-skill
// File mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (JSON array)
//   digs/<NN>-<slug>.json     -> DigRecord (one per subtopic)
//   jev-log.json              -> JevLogEntry[] (JSON array)
//   docs/NN-<slug>.md         -> authored corpus docs (not typed here)

export interface DecisionAnswer {
  type: "noul" | "score";
  noul?: number;      // noul metric: probability the source is worth citing
  score?: number;     // score metric: 0 = padding, 1 = marginal, 2 = load-bearing
  legend?: Record<string, string>;
  probabilities?: Record<string, number>;
  confidence?: number;
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: DecisionAnswer;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string; // ISO 8601
}

export interface DugResult {
  query: string;            // searxng query that returned this result
  title: string;
  url: string;
  snippet: string;
  collected_at: string;     // ISO 8601
  weight: number | null;    // noul probability; null only if weighting permanently failed
  decision: DecisionRecord;
  redo_of: number | null;   // index of superseded unweighted entry when rescored
  // dig-side annotations (not in the strict schema, kept for provenance):
  nn?: string;              // owning subtopic number, e.g. "03"
  slug?: string;            // owning subtopic slug
  attempt?: number;         // which dig attempt (1 = seed, 2/3 = redos)
  redo_count?: number;
}

export interface QueryAttempt {
  query: string;
  attempt: number;          // 1 = seed, 2/3 = redo
  raw_results: number;
  kept: number;
  error?: string;
  redo_index?: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;       // dig redos (different queries), 0-2
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];   // urls kept for authoring
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];     // lowest-first
    model: "clef";
    answers: Record<string, DecisionAnswer>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];      // nn values scored 0
    kept: string[];
  };
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;         // e.g. /api/decide
  state: string;            // corpus REF
  model: "clef";
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score")[];
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface PreflightRecord {
  date: string;             // e.g. 2026-10-05
  searxng: {
    url: string;
    probe_results: { status: number | string; n_results: number; sample_titles: string[] } | { status: string; error: string };
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: "clef";
    probe_answer: unknown;
  };
}
