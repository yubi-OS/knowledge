// research-db schema for knowledge/edge-map-standardization (minted 2026-10-05)
export interface PreflightEntry { timestamp: string; searxng: { url: string; results: number; healthy: boolean; note?: string }; decide: { url: string; model: string; usage: object; healthy: boolean } }
export interface OutlineSubtopic { nn: number; slug: string; scope: string; seed_queries: string[] }
export interface OutlineValidation { answers: Record<string, object>; usage?: object; kept: string[]; dropped: string[] }
export interface OutlineRecord { topic: string; subtopics: OutlineSubtopic[]; generated_at: string; score_validation?: OutlineValidation }
export interface WeightDecision { type: 'noul' | 'score' | 'choice'; instructions: string; model?: string; answer: object; usage?: object; requested_at: string }
export interface ArchiveEntry { doc: string; query: string; title: string; url: string; snippet: string; collected_at: string; weight: number | null; decision?: WeightDecision; redo_of?: string }
export interface DigsQueryAttempt { query: string; attempt: number; raw_results: number; kept: number; redo?: boolean }
export interface DigsRecord { nn: number; slug: string; scope: string; queries_attempted: DigsQueryAttempt[]; redo_count: number; redo_log: string[]; results_kept: number; outcome: 'authored' | 'skipped'; skip_reason?: string }
export interface JevLogEntry { timestamp: string; endpoint: string; model?: string; n_questions?: number; usage?: object; redo?: boolean }
