import type { InvoiceOrder } from "./invoice";

const KEY = "synchroma-orders";
const MAX_SAVED = 20;

export interface StoredOrder {
  order: InvoiceOrder;
  ts: number;
}

export const TRACK_STAGES = [
  "Order Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

const MS_PER_STAGE = 3 * 60 * 1000;

function readAll(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: InvoiceOrder): void {
  try {
    const list = readAll();
    list.unshift({ order, ts: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
  } catch {
    /* quota */
  }
}

export function findOrder(id: string): StoredOrder | undefined {
  const q = id.trim().toUpperCase();
  if (!q) return undefined;
  return readAll().find((s) => s.order.id.toUpperCase() === q);
}

export function recentOrders(): StoredOrder[] {
  return readAll();
}

export function getStageIndex(ts: number, now: number = Date.now()): number {
  const elapsed = Math.max(0, now - ts);
  return Math.min(TRACK_STAGES.length - 1, Math.floor(elapsed / MS_PER_STAGE));
}

export function getStageTimes(ts: number): string[] {
  return TRACK_STAGES.map((_, i) =>
    new Date(ts + i * MS_PER_STAGE).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
