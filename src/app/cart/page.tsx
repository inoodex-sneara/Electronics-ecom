import type { Metadata } from "next";
import CartPage from "@/components/cart-page";

export const metadata: Metadata = {
  title: "Your Cart | Synchroma",
  description: "Review items in your shopping cart and proceed to checkout.",
};

export default function Page() {
  return <CartPage />;
}
