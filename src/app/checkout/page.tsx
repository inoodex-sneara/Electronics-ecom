import type { Metadata } from "next";
import CheckoutPage from "@/components/checkout-page";

export const metadata: Metadata = {
  title: "Checkout | Synchroma",
  description: "Complete your order securely at Synchroma.",
};

export default function Page() {
  return <CheckoutPage />;
}
