// research-db type map for knowledge/endlessh-openwrt-fit
// preflight.json            -> PreflightRecord
// outline.json              -> OutlineRecord
// archive.json              -> DugResult[] (one entry per collected search result)
// digs/<NN>-<slug>.json     -> DigRecord
// jev-log.json              -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_query?: string;
    probe_results: number | null;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown | null;
  };
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
    model: string | null;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];
    kept: string[];
  };
}

/** File: archive.json */
export interface DugResult {
  nn: string;
  slug: string;
  query: string;
  title: string | null;
  url: string | null;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

/** Embedded in DugResult.decision; full record of one jev decision */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.9356 }
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** File: digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
    status?: number;
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: Array<string | null>;
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** File: jev-log.json */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: Array<string | undefined>;
  usage: { input_tokens: number; output_tokens: number } | null;
}
