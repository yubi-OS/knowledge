// Typed index for the linear-viscoelasticity corpus (minted 2026-10-02).
export interface DigResult {
  title: string;
  url: string;
  engine: string;
  jev_weight: number | null;
  task_ids: string[];
  timestamp: string;
}
export interface DigRecord {
  doc: string;
  queries: string[];
  results: DigResult[];
  preflight_ref: string;
  dig_fallback?: string;
}
export interface Preflight {
  date: string;
  searxng: { results: number; healthy: boolean; note: string };
  jev_decide: { endpoint: string; status: number; model: string; smoke_task_id: string; smoke_cost: string };
}
export interface QcLogEntry {
  call: string;
  endpoint: string;
  task_id: string;
  cost_usd: string;
  answers: Record<string, unknown>;
}
import * as digs01 from "./digs/01.json";
import * as digs07 from "./digs/07.json";
export const corpus = "linear-viscoelasticity";
export const minted = "2026-10-02";
export const anchor = "Roylance, Engineering Viscoelasticity (MIT, 2001)";
export const digRecords: DigRecord[] = [digs01 as unknown as DigRecord, digs07 as unknown as DigRecord];
