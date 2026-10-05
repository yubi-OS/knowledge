// Typed index for the fido2-secure-boot-boundary research DB (schema v2).
export interface DecisionRecord { type: "noul" | "score" | "choice"; instructions: string; model: string; answer: Record<string, unknown>; usage: { input_tokens: number; output_tokens: number }; requested_at: string; }
export interface DugResult { query: string; title: string; url: string; snippet: string; collected_at: string; weight: number | null; decision?: DecisionRecord; }
export interface DigRecord { slug: string; scope: string; queries_attempted: { query: string; attempt: number; raw_results: number | null; kept: number }[]; redo_count: number; redo_log: { attempt: number; reason: string; new_queries: string[] }[]; results_kept: string[]; outcome: "authored" | "skipped"; skip_reason?: string; }
export interface OutlineRecord { topic: string; subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[]; validation: { metric: "score"; criteria: string[]; model: string; answers: Record<string, unknown>; usage: unknown; dropped: string[]; kept: string[] }; }
export interface JevLogEntry { requested_at: string; endpoint: string; state: string; model: string; n_questions: number; question_names: string[]; metric_types: string[]; usage: { input_tokens: number; output_tokens: number }; }
export interface PreflightRecord { date: string; searxng: Record<string, unknown>; decide: Record<string, unknown>; }
// archive.json: DugResult[]; digs/<slug>.json: DigRecord; outline.json: OutlineRecord; jev-log.json: JevLogEntry[]; preflight.json: PreflightRecord
