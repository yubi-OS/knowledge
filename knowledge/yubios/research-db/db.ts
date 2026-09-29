// Research DB: yubios knowledge corpus mint, 2026-09-29
// Raw data: archive.json + digs/*.json next to this file. Requires resolveJsonModule.
export interface OutlineDoc { i: number; slug: string; scope: string; score: number; conf?: unknown }
export interface SearchResult { title: string; url: string; engines: string[]; snippet: string; jev_quality_noul: number | null; jev_task_id?: string }
export interface DigQuery { query: string | null; n_results: number | null; error?: string; top: SearchResult[] }
export const RUN_DATE = '2026-09-29';
export const REF = 'yubios';
export const OUTLINE_DOCS: OutlineDoc[] = /* archive.json.outline */;
export const DIG_DOCS: string[] = ['01-architecture-overview','02-yubikey-trust-boundaries','03-boot-chain-and-ukis','04-supply-chain-gates','05-arm64-hardware-path','06-ci-and-test-infrastructure'];
