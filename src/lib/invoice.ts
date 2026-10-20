import { formatBdt } from "@/data/products";
import type { CartItem } from "@/providers/cart-context";

export type InvoiceDeliveryZone = "inside" | "outside";
export type InvoicePaymentMethod = "bkash" | "nagad" | "cod" | "card";

export interface InvoiceOrder {
  id: string;
  placedAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  note: string;
  zone: InvoiceDeliveryZone;
  method: InvoicePaymentMethod;
  trxId: string;
  cardLast4: string;
}

const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildInvoiceHtml(order: InvoiceOrder, paymentLabel: string): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e4e4e7;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${typeof window !== "undefined" ? window.location.origin : ""}${i.image}" alt="" width="44" height="44" style="object-fit:contain;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa;" />
            <div>
              <div style="font-weight:700;color:#18181b;font-size:13px;">${esc(i.name)}</div>
              <div style="font-size:11px;color:#71717a;">${esc(i.brand)}${i.color ? ` · ${esc(i.color)}` : ""}</div>
            </div>
          </div>
        </td>
        <td style="padding:10px 8px;text-align:center;border-bottom:1px solid #e4e4e7;font-size:13px;">${i.qty}</td>
        <td style="padding:10px 8px;text-align:right;border-bottom:1px solid #e4e4e7;font-size:13px;font-weight:700;">${formatBdt(i.price)}</td>
        <td style="padding:10px 8px;text-align:right;border-bottom:1px solid #e4e4e7;font-size:13px;font-weight:800;">${formatBdt(i.price * i.qty)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${order.id} | Synchroma</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; color: #18181b; background: #fff; padding: 32px; }
  .wrap { max-width: 720px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 16px; border-bottom: 3px solid #059669; }
  .brand { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
  .brand span { color: #059669; }
  .tag { font-size: 11px; color: #71717a; margin-top: 4px; }
  .meta { text-align: right; font-size: 12px; color: #52525b; line-height: 1.7; }
  .meta strong { color: #18181b; }
  .badge { display: inline-block; background: #059669; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-top: 8px; }
  .cols { display: flex; gap: 16px; margin-top: 20px; }
  .card { flex: 1; background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 14px; }
  .card h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; margin-bottom: 8px; }
  .card p { font-size: 13px; line-height: 1.55; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #71717a; padding: 8px; border-bottom: 2px solid #18181b; }
  th:nth-child(2) { text-align: center; }
  th:nth-child(3), th:nth-child(4) { text-align: right; }
  .totals { margin-top: 16px; margin-left: auto; width: 260px; }
  .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #52525b; }
  .totals .grand { border-top: 2px solid #18181b; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 900; color: #18181b; }
  .foot { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e4e4e7; font-size: 11px; color: #71717a; text-align: center; line-height: 1.6; }
  .noprint { margin-top: 24px; text-align: center; }
  .noprint button { background: #059669; color: #fff; border: 0; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; cursor: pointer; }
  .noprint button:hover { background: #047857; }
  @media print { .noprint { display: none !important; } body { padding: 0; } }
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div>
      <div class="brand">Synchro<span>ma</span><sup style="font-size:10px;">&reg;</sup></div>
      <div class="tag">Tech Electronics Store · www.synchroma.com</div>
      <div class="badge">PAID / ${esc(paymentLabel.toUpperCase())}</div>
    </div>
    <div class="meta">
      <div><strong>INVOICE</strong></div>
      <div>No: <strong>${esc(order.id)}</strong></div>
      <div>Date: <strong>${esc(order.placedAt)}</strong></div>
    </div>
  </div>

  <div class="cols">
    <div class="card">
      <h3>Billed To</h3>
      <p>
        <strong>${esc(order.name)}</strong><br />
        ${esc(order.address)}<br />
        ${esc(order.area)}, ${esc(order.city)}<br />
        ${esc(order.phone)}${order.email ? `<br />${esc(order.email)}` : ""}
        ${order.note ? `<br /><em>Note: ${esc(order.note)}</em>` : ""}
      </p>
    </div>
    <div class="card">
      <h3>Order Info</h3>
      <p>
        Zone: <strong>${order.zone === "inside" ? "Inside Dhaka (1–2 days)" : "Outside Dhaka (3–5 days)"}</strong><br />
        Payment: <strong>${esc(paymentLabel)}</strong><br />
        ${order.method === "bkash" || order.method === "nagad" ? `TrxID: <strong>${esc(order.trxId)}</strong><br />` : ""}
        ${order.method === "card" ? `Card: <strong>•••• ${esc(order.cardLast4)}</strong><br />` : ""}
        ${order.method === "cod" ? "Pay rider on delivery<br />" : ""}
        Contact: <strong>01700-000000</strong>
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><span>${formatBdt(order.subtotal)}</span></div>
    <div><span>Delivery</span><span>${formatBdt(order.deliveryFee)}</span></div>
    <div class="grand"><span>Total</span><span>${formatBdt(order.total)}</span></div>
  </div>

  <div class="foot">
    Thank you for shopping at Synchroma. Keep this invoice for warranty &amp; returns.<br />
    This is a computer-generated invoice — no signature required.
  </div>
  <div class="noprint">
    <button onclick="window.print()">Download / Print PDF</button>
  </div>
</div>
</body>
</html>`;
}

export function openInvoicePdf(order: InvoiceOrder, paymentLabel: string): void {
  if (typeof window === "undefined") return;
  const html = buildInvoiceHtml(order, paymentLabel);
  const win = window.open("", "_blank", "width=860,height=900");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch {
      /* user can click the button in the invoice */
    }
  }, 400);
}
