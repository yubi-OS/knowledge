// Typed index for the covenant-conflict-policy research DB (backfilled 2026-10-05).
export interface DugResult { query: string; title: string; url: string; snippet: string; weight: number | null; decision?: unknown; redo_of?: number | null; }
export interface ArchiveEntry extends DugResult {}
// archive.json: DugResult[]
