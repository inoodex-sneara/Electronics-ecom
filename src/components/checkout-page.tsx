"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Home,
  Landmark,
  Lock,
  MapPin,
  Package,
  Phone,
  Printer,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import { formatBdt } from "@/data/products";
import { useCart } from "@/providers/cart-context";
import { openInvoicePdf, buildInvoiceHtml, type InvoiceOrder } from "@/lib/invoice";

function BkashIcon({ size = 24 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/payment/bkash-logo.svg"
      alt="bKash"
      width={size * (87.43 / 40)}
      height={size}
      className="object-contain"
      draggable={false}
    />
  );
}

function NagadIcon({ size = 24 }: { size?: number }) {
  return (
    <Image
      src="/images/payment/nagad.png"
      alt="Nagad"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

type Step = 1 | 2 | 3;
type DeliveryZone = "inside" | "outside";
type PaymentMethod = "bkash" | "nagad" | "cod" | "card";

type OrderSnapshot = InvoiceOrder;

const ZONE_FEE: Record<DeliveryZone, number> = { inside: 60, outside: 120 };

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "bkash",
    label: "bKash",
    desc: "Mobile financial service",
    icon: null,
  },
  {
    id: "nagad",
    label: "Nagad",
    desc: "Mobile financial service",
    icon: null,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when you receive",
    icon: <Banknote className="size-5 text-emerald-600" />,
  },
  {
    id: "card",
    label: "Card",
    desc: "Visa · Mastercard · Amex",
    icon: <CreditCard className="size-5 text-indigo-500" />,
  },
];

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-shadow";

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
}

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <span
      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
        done
          ? "bg-emerald-600 text-white"
          : active
            ? "bg-zinc-950 text-white"
            : "bg-zinc-100 text-zinc-400"
      }`}
    >
      {done ? <Check className="size-3.5" /> : n}
    </span>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);

  // Form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [note, setNote] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("inside");
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [trxId, setTrxId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = ZONE_FEE[zone];
  const total = subtotal + deliveryFee;

  const steps: { n: Step; label: string }[] = useMemo(
    () => [
      { n: 1, label: "Shipping" },
      { n: 2, label: "Payment" },
      { n: 3, label: "Review" },
    ],
    []
  );

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 3) e.fullName = "Enter full name";
    if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter valid BD mobile (e.g. 017XXXXXXXX)";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
    if (address.trim().length < 8) e.address = "Enter full address";
    if (!city.trim()) e.city = "Required";
    if (!area.trim()) e.area = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (method === "bkash" || method === "nagad") {
      if (!trxId.trim() || trxId.trim().length < 6)
        e.trxId = "Enter transaction ID after payment";
    }
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 12) e.cardNumber = "Invalid card number";
      if (cardName.trim().length < 3) e.cardName = "Name on card required";
      if (!/^\d{2}\s?\/\s?\d{2}$/.test(cardExp.trim())) e.cardExp = "MM/YY";
      if (cardCvc.replace(/\D/g, "").length < 3) e.cardCvc = "CVC";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1) {
      if (!validateShipping()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!validatePayment()) return;
      setStep(3);
    }
  };

  const goBack = () => {
    setErrors({});
    if (step > 1) setStep((s) => (s - 1) as Step);
    else router.push("/cart");
  };

  const placeOrder = () => {
    if (placing) return;
    setPlacing(true);
    setTimeout(() => {
      const id = `SYN${Date.now().toString().slice(-8)}`;
      const snapshot: OrderSnapshot = {
        id,
        placedAt: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        items: items.map((i) => ({ ...i })),
        subtotal,
        deliveryFee,
        total,
        name: fullName,
        phone,
        email,
        address,
        city,
        area,
        note,
        zone,
        method,
        trxId,
        cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
      };
      setOrder(snapshot);
      setOrderId(id);
      setPlaced(true);
      setPlacing(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const downloadInvoice = () => {
    if (!order) return;
    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === order.method)?.label ?? order.method;
    openInvoicePdf(order, paymentLabel);
  };

  const invoiceHtml = useMemo(() => {
    if (!order) return "";
    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === order.method)?.label ?? order.method;
    return buildInvoiceHtml(order, paymentLabel);
  }, [order]);

  // Empty cart / success screens
  if (placed) {
    return (
      <div className="w-full min-h-screen pb-16 relative overflow-hidden bg-zinc-50">
        {/* Hero */}
        <div className="relative bg-emerald-950 text-white">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, #059669 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 80% 100%, #0d9488 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10 text-center">
            <span className="mx-auto size-14 rounded-full bg-white/10 border border-emerald-400/40 backdrop-blur flex items-center justify-center">
              <span className="size-9 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-white" strokeWidth={2.5} />
              </span>
            </span>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
              Thank you · ধন্যবাদ
            </p>
            <h1 className="mt-2 text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Your order is{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                confirmed!
              </span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/75 max-w-md mx-auto leading-relaxed">
              We&apos;ve received your order and started preparing it. Your invoice is ready
              below.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={downloadInvoice}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white text-emerald-950 hover:bg-emerald-50 px-5 py-2.5 text-xs font-black shadow-lg shadow-black/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="size-3.5 transition-transform group-hover:translate-y-0.5" />
                Download Invoice PDF
              </button>
              <Link
                href="/track-order"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold backdrop-blur transition-all"
              >
                <Truck className="size-3.5" />
                Track Order
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold backdrop-blur transition-all"
              >
                Continue Shopping
              </Link>
            </div>
            <p className="mt-3.5 text-[10px] text-emerald-200/45">
              Invoice opens a print dialog — choose{" "}
              <strong className="text-emerald-200/70">Save as PDF</strong>
            </p>
          </div>
          {/* scallop bottom */}
          <div className="absolute bottom-0 inset-x-0 h-5 bg-zinc-50 rounded-t-[20px]" />
        </div>

        {/* Delivery progress */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-1">
          <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              {[
                { label: "Confirmed", active: true },
                { label: "Packed", active: false },
                { label: "Shipped", active: false },
                { label: "Delivered", active: false },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <span
                      className={`size-8 rounded-full flex items-center justify-center text-[11px] font-black ${
                        s.active
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                      }`}
                    >
                      {s.active ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-bold truncate ${
                        s.active ? "text-emerald-700" : "text-zinc-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-1 rounded-full bg-zinc-100 mt-[-18px] mx-1 overflow-hidden">
                      <div
                        className={`h-full bg-emerald-500 ${s.active ? "w-full" : "w-0"}`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <FileText className="size-4 text-emerald-600" />
              </span>
              <div>
                <h2 className="text-sm font-black text-zinc-900">Your Invoice</h2>
                <p className="text-[11px] text-zinc-400">Review below · download anytime</p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadInvoice}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="size-3.5" />
              Print / Save PDF
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <iframe
              title={`Invoice ${orderId}`}
              srcDoc={invoiceHtml}
              className="w-full h-[720px] sm:h-[860px] border-0"
            />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-lg px-4 sm:px-6 py-16 sm:py-24">
          <div className="rounded-3xl bg-white border border-zinc-200 p-8 sm:p-10 text-center">
            <span className="mx-auto size-16 rounded-full bg-zinc-50 flex items-center justify-center">
              <Package className="size-8 text-zinc-400" />
            </span>
            <h1 className="mt-5 text-xl font-black text-zinc-950">Nothing to checkout</h1>
            <p className="mt-1.5 text-sm text-zinc-500">Add products to your cart first.</p>
            <Link
              href="/cart"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-bold transition-colors"
            >
              Go to Cart
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-28 lg:pb-16">
      {/* Header + steps */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Link href="/cart" className="hover:text-zinc-900 inline-flex items-center gap-1">
              <Home className="size-3" />
              Cart
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-zinc-900">Checkout</span>
          </nav>

          <h1 className="mt-2 text-2xl font-black text-zinc-950">Checkout</h1>

          {/* Stepper */}
          <div className="mt-5 flex items-center">
            {steps.map((s, i) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <React.Fragment key={s.n}>
                  <div className="flex items-center gap-2">
                    <StepBadge n={s.n} active={active} done={done} />
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        active ? "text-zinc-950" : done ? "text-emerald-700" : "text-zinc-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mx-2 sm:mx-3 h-px flex-1 min-w-4 bg-zinc-200">
                      <div
                        className={`h-full bg-emerald-500 transition-all duration-300 ${
                          step > s.n ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main column */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div className="rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MapPin className="size-5 text-emerald-600" />
                </span>
                <div>
                  <h2 className="text-base font-black text-zinc-950">Shipping information</h2>
                  <p className="text-xs text-zinc-500">Where should we deliver?</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Full name" id="fullName" required error={errors.fullName}>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahim Uddin"
                        className={`${inputBase} pl-9`}
                        autoComplete="name"
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Mobile number" id="phone" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      inputMode="tel"
                      className={`${inputBase} pl-9`}
                      autoComplete="tel"
                    />
                  </div>
                </Field>

                <Field label="Email (optional)" id="email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputBase}
                    autoComplete="email"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Street address" id="address" required error={errors.address}>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="House, road, area, landmark…"
                      className={`${inputBase} resize-none`}
                      autoComplete="street-address"
                    />
                  </Field>
                </div>

                <Field label="City / District" id="city" required error={errors.city}>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dhaka"
                    className={inputBase}
                  />
                </Field>

                <Field label="Area / Thana" id="area" required error={errors.area}>
                  <input
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Dhanmondi"
                    className={inputBase}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Delivery note (optional)" id="note">
                    <input
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Call before delivery, gate code…"
                      className={inputBase}
                    />
                  </Field>
                </div>
              </div>

              {/* Zone */}
              <div className="mt-5">
                <p className="text-xs font-bold text-zinc-700 mb-2">Delivery zone</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      { id: "inside" as const, label: "Inside Dhaka", fee: 60, time: "1–2 days" },
                      {
                        id: "outside" as const,
                        label: "Outside Dhaka",
                        fee: 120,
                        time: "3–5 days",
                      },
                    ] as const
                  ).map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setZone(z.id)}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        zone === z.id
                          ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-zinc-900">{z.label}</span>
                        {zone === z.id && (
                          <CheckCircle2 className="size-5 text-emerald-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{z.time}</p>
                      <p className="mt-1.5 text-sm font-bold text-emerald-700">
                        Delivery {formatBdt(z.fee)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 hidden lg:flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Continue to Payment
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Lock className="size-5 text-emerald-600" />
                </span>
                <div>
                  <h2 className="text-base font-black text-zinc-950">Payment method</h2>
                  <p className="text-xs text-zinc-500">Choose how you&apos;d like to pay</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setMethod(opt.id);
                      setErrors({});
                    }}
                    className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      method === opt.id
                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {opt.id === "bkash" ? (
                          <BkashIcon size={22} />
                        ) : opt.id === "nagad" ? (
                          <NagadIcon size={26} />
                        ) : (
                          opt.icon
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-zinc-900">{opt.label}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">{opt.desc}</p>
                      </div>
                      {method === opt.id && (
                        <CheckCircle2 className="size-5 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment details panel */}
              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5">
                {(method === "bkash" || method === "nagad") && (
                  <div>
                    <div className="flex items-center gap-2.5">
                      {method === "bkash" ? <BkashIcon /> : <NagadIcon />}
                      <p className="text-sm font-bold text-zinc-900">
                        Send money via {method === "bkash" ? "bKash" : "Nagad"} then enter TrxID
                      </p>
                    </div>
                    <ol className="mt-2.5 space-y-1.5 text-xs text-zinc-600 list-decimal list-inside">
                      <li>
                        Dial *{method === "bkash" ? "*247#" : "*167#"} or open the app
                      </li>
                      <li>
                        Send <strong className="text-zinc-900">{formatBdt(total)}</strong> to{" "}
                        <strong className="text-zinc-900">01700-000000</strong> (Merchant)
                      </li>
                      <li>Paste the Transaction ID below</li>
                    </ol>
                    <div className="mt-4">
                      <Field
                        label="Transaction ID"
                        id="trxId"
                        required
                        error={errors.trxId}
                      >
                        <input
                          id="trxId"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="e.g. 9HXA2XK1LM"
                          className={`${inputBase} font-mono uppercase`}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {method === "cod" && (
                  <div className="flex items-start gap-3">
                    <span className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Banknote className="size-5 text-emerald-700" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Cash on Delivery — {formatBdt(total)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                        Keep exact change ready. Our rider accepts cash only. Please inspect the
                        package before paying.
                      </p>
                    </div>
                  </div>
                )}

                {method === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Field label="Card number" id="cardNumber" required error={errors.cardNumber}>
                        <input
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16)
                                .replace(/(\d{4})(?=\d)/g, "$1 ")
                            )
                          }
                          placeholder="4242 4242 4242 4242"
                          inputMode="numeric"
                          className={`${inputBase} font-mono tracking-wider`}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Name on card" id="cardName" required error={errors.cardName}>
                        <input
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="RAHIM UDDIN"
                          className={`${inputBase} uppercase`}
                        />
                      </Field>
                    </div>
                    <Field label="Expiry" id="cardExp" required error={errors.cardExp}>
                      <input
                        id="cardExp"
                        value={cardExp}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                          setCardExp(v);
                        }}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className={`${inputBase} font-mono`}
                      />
                    </Field>
                    <Field label="CVC" id="cardCvc" required error={errors.cardCvc}>
                      <input
                        id="cardCvc"
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="123"
                        inputMode="numeric"
                        className={`${inputBase} font-mono`}
                      />
                    </Field>
                    <p className="sm:col-span-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Lock className="size-3.5 text-emerald-600" />
                      Demo only — no real charge. Card data never leaves your browser.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Review Order
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-zinc-950">Review &amp; place order</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Edit shipping
                  </button>
                </div>

                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3.5">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Ship to
                    </dt>
                    <dd className="mt-1.5 font-semibold text-zinc-900 leading-relaxed">
                      {fullName}
                      <br />
                      {address}, {area}, {city}
                      <br />
                      <span className="text-zinc-600">{phone}</span>
                      {note && (
                        <>
                          <br />
                          <span className="text-zinc-500 italic">Note: {note}</span>
                        </>
                      )}
                    </dd>
                    <p className="mt-2 text-xs font-bold text-emerald-700">
                      {zone === "inside" ? "Inside Dhaka · 1–2 days" : "Outside Dhaka · 3–5 days"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3.5">
                    <div className="flex items-center justify-between">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Payment
                      </dt>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <dd className="mt-1.5 font-semibold text-zinc-900">
                      {PAYMENT_OPTIONS.find((p) => p.id === method)?.label}
                    </dd>
                    {(method === "bkash" || method === "nagad") && (
                      <p className="mt-1 text-xs text-zinc-600 font-mono">TrxID: {trxId}</p>
                    )}
                    {method === "card" && (
                      <p className="mt-1 text-xs text-zinc-600 font-mono">
                        •••• {cardNumber.replace(/\s/g, "").slice(-4) || "····"}
                      </p>
                    )}
                    {method === "cod" && (
                      <p className="mt-1 text-xs text-zinc-600">Pay rider on delivery</p>
                    )}
                  </div>
                </dl>

                {/* Items */}
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Items ({count})
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-2.5"
                      >
                        <div className="relative size-12 rounded-lg bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500">Qty {item.qty}</p>
                        </div>
                        <p className="text-sm font-black text-zinc-900 tabular-nums shrink-0">
                          {formatBdt(item.price * item.qty)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placing}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {placing ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Place Order · {formatBdt(total)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-5 xl:col-span-4 order-first lg:order-none">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white border border-zinc-200 p-5">
              <h2 className="text-base font-black text-zinc-950">Order summary</h2>

              <ul className="mt-4 space-y-3 max-h-52 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative size-12 rounded-lg bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-zinc-950 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                      {item.color && (
                        <p className="text-[11px] text-zinc-400">{item.color}</p>
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-900 tabular-nums shrink-0">
                      {formatBdt(item.price * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900 tabular-nums">
                    {formatBdt(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>
                    Delivery{" "}
                    <span className="text-[11px] text-zinc-400">
                      ({zone === "inside" ? "Inside Dhaka" : "Outside Dhaka"})
                    </span>
                  </span>
                  <span className="font-bold text-zinc-900 tabular-nums">
                    {formatBdt(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-zinc-700">Total</span>
                <span className="text-2xl font-black text-zinc-950 tabular-nums">
                  {formatBdt(total)}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-white border border-zinc-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-700">Buyer protection</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Package className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-700">Secure packaging</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Landmark className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-700">Official warranty support</span>
              </div>
            </div>

            {/* Mobile sticky place (step 3) */}
            {step === 3 && (
              <div className="mt-3 lg:hidden">
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {placing ? "Placing…" : `Place Order · ${formatBdt(total)}`}
                </button>
              </div>
            )}

            {/* Mobile next/back for steps 1–2 */}
            {step < 3 && (
              <div className="mt-3 lg:hidden flex gap-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-3 text-sm font-bold cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-bold transition-colors active:scale-[0.98] cursor-pointer"
                >
                  {step === 1 ? "Continue to Payment" : "Review Order"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {/* Mobile step 1 next also in content — hide duplicate desktop button under lg already */}
          </div>
        </aside>
      </div>
    </div>
  );
}
