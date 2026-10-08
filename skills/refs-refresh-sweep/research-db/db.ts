// Typed index over the refs-refresh-sweep research DB (schema v2).
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (array of DugResult)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord (one per subtopic doc)
//   research-db/jev-log.json            -> JevLogEntry[]
//
// Run constants: corpus minted 2026-10-06, ground source
// yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md, model typesafe/jev-1.13
// via DefAPI direct (https://api.defapi.org/api/v1/decisions).
// Note: DefAPI returns usage per REQUEST, not per result; per-request usage
// lives in JevLogEntry.usage and jev-log.json. DugResult.decision.usage is
// therefore null per result (with an explanatory note field).

export const RUN_DATE = "2026-10-06";
export const GROUND_SOURCE =
  "yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md";
export const DECIDE_ENDPOINT = "https://api.defapi.org/api/v1/decisions";
export const DECIDE_MODEL = "typesafe/jev-1.13";
export const SEARXNG_URL =
  "https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng";
export const CORPUS_DIR = "skills/refs-refresh-sweep";
export const BRANCH = "mint/skills-refs-refresh-sweep-2026-10-06";

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string;
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}

export interface OutlineQuestion {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, OutlineQuestion>;
    usage?: { input_tokens?: number; output_tokens?: number; cost?: number };
    dropped: string[];
    kept: string[];
    notes?: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number | null; output_tokens: number | null; note?: string };
  requested_at: string;
}

export interface DugResult {
  rid: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
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
  note?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
}
