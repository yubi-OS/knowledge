// Research DB: systemd-usage knowledge corpus mint, 2026-09-30
// Raw data: archive.json + digs/*.json next to this file. Requires resolveJsonModule.
export interface Preflight { searxng: { results: number; suspended_engines: string[]; healthy: boolean }; jev: { healthy: boolean } }
export interface OutlineDoc { i: number; slug: string; scope: string; score: number; conf?: unknown }
export interface SearchResult { title: string; url: string; engines: string[]; snippet: string; jev_quality_noul: number | null; jev_task_id?: string }
export interface DigQuery { query: string | null; n_results: number | null; error?: string; top: SearchResult[] }
export const RUN_DATE = '2026-09-30';
export const REF = 'systemd-usage';
export const OUTLINE_DOCS: OutlineDoc[] = /* archive.json.outline */;
export const DIG_DOCS: string[] = " + json.dumps(list(digs_out.keys())) + ";
