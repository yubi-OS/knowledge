// db.ts — TypeScript interfaces for the sealed-uki-vm-test research-db (schema v2).
// File mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (one entry per collected search result)
//   digs/*.json     -> DigRecord
//   jev-log.json    -> JevLogEntry[]

/** preflight.json — endpoint health probes taken before the mint started. */
export interface PreflightRecord {
  date: string; // ISO date of the mint
  searxng: {
    url: string; // searXNG proxy webhook endpoint
    probe_results: number; // result count returned by the probe query
    unresponsive_engines: string[]; // engines the proxy reported as unresponsive
  };
  decide: {
    url: string; // jev /api/decide endpoint
    model: string; // decision model name (clef)
    probe_answer: unknown; // raw answer object from the sanity probe question
  };
}

/** outline.json — topic decomposition plus the jev score validation round. */
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string; // two-digit outline order, e.g. "01"
    slug: string; // doc slug, e.g. "uki-anatomy-signing"
    scope: string; // one-line scope statement
    seed_queries: string[]; // 2 searXNG seed queries
  }[];
  validation: {
    metric: "score"; // metric used for outline validation
    criteria: string[]; // lowest-first criteria list
    model: string;
    answers: Record<string, unknown>; // keyed by t01..tNN, raw answer objects
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values with score 0
    kept: string[]; // nn values kept for digging
  };
}

/** archive.json entry — one collected search result with its jev weighting. */
export interface DugResult {
  query: string; // searXNG query that produced the result
  title: string;
  url: string;
  snippet: string; // trimmed content snippet at collection time
  collected_at: string | null; // ISO timestamp of the weighting batch that scored it
  weight: number | null; // noul probability; >= 0.5 counts as authoritative
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry, if rescored
}

/** The decision-model record embedded in each DugResult. */
export interface DecisionRecord {
  type: "noul"; // metric type used for weighting
  instructions: string; // exact instructions sent to the model
  model: string; // "clef"
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.86 }
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string | null;
}

/** digs/<NN>-<slug>.json — per-subtopic dig record. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number; // 1 for the first pass, 2+ for redos
    raw_results: number; // results returned before keeping
    kept: number; // results kept (top 6 per query)
  }[];
  redo_count: number; // number of dig redos performed
  redo_log: {
    attempt: number;
    reason: string; // why the dig was redone
    new_queries: string[];
  }[];
  results_kept: string[]; // urls kept for this subtopic
  outcome: "authored" | "skipped";
  skip_reason?: string; // present only when outcome is "skipped"
}

/** jev-log.json entry — one HTTP request to /api/decide. */
export interface JevLogEntry {
  requested_at: string; // ISO timestamp
  endpoint: string;
  state: string; // jev state, here the corpus REF
  model: string; // "clef"
  n_questions: number; // number of questions in the request
  question_names: string[]; // question keys, e.g. ["t01", ...] or ["r01", ...]
  metric_types: string[]; // one per question, e.g. ["score"] or ["noul", ...]
  usage: { input_tokens: number; output_tokens: number };
  note?: string; // present on failed (429) attempts recorded for audit
}
