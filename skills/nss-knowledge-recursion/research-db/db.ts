// research-db/db.ts - TypeScript interfaces for the nss-knowledge-recursion knowledge corpus research database.
// File -> interface map:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[]
//   digs/*.json    -> DigRecord
//   jev-log.json   -> JevLogEntry[]

/** preflight.json - the health-check record for the mint run. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    note?: string;
    probe_answer?: unknown;
  };
}

/** outline.json - topic decomposition plus the jev score validation of each subtopic. */
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: SubtopicRecord[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: JevUsage;
    dropped: string[];
    kept: string[];
  };
}

export interface SubtopicRecord {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record: boolean;
}

/** archive.json (one array element) - a collected search result with its noul decision. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  redo_of: number | null;
  decision: DecisionRecord;
}

/** The full decision record stored per result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: {
    type: string;
    noul?: number;
    legend?: Record<string, string>;
    confidence?: number;
    [k: string]: unknown;
  };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** digs/*.json - per-subtopic dig attempt record. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json (one array element) - one jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: JevUsage;
}

export interface JevUsage {
  input_tokens: number;
  output_tokens: number;
  cost?: number;
}
