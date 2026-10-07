// research-db type interfaces for the skills/nss-mode knowledge corpus (schema v2).
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (JSON array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (JSON array of JevLogEntry)
//
// Notes on conventions used by this corpus:
// - archive.json decisions were made via DefAPI direct (POST https://api.defapi.org/api/v1/decisions,
//   model typesafe/jev-1.13). Each request batched 12 noul questions; the usage tokens recorded on
//   each decision record are the usage of the HTTP request that carried that question (see jev-log.json
//   for the request-level rows).
// - decision.answer is the raw answer object exactly as returned; for the noul metric its shape is
//   {"type":"noul","noul":<probability>} and weight == answer.noul.
// - collected_at is the canonical dig-pass completion window (2026-10-07T22:41:30Z for attempt-1 and
//   doc-01 attempt-2 results; 2026-10-07T22:44:00Z for the doc 03/04/05 attempt-2 redos), recorded
//   before the corresponding weighting batch.
// - redo_of carries the result id of the first superseded attempt-1 entry of the same subtopic
//   ("r001" for doc 01's attempt-2 redo, "r025"/"r037"/"r049" for docs 03/04/05).

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: { type: string; noul?: number; score?: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
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
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: unknown; note?: string };
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score" | "choice")[];
  usage: { input_tokens: number; output_tokens: number };
}
