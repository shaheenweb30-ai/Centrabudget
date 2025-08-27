// /components/ProCheckout.tsx
import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { createClient } from "@supabase/supabase-js";

interface ProCheckoutProps {
  priceId: string;
  planId?: string;
  billingCycle?: 'monthly' | 'yearly';
}

export default function ProCheckout({ 
  priceId, 
  planId = 'pro', 
  billingCycle = 'monthly' 
}: ProCheckoutProps) {
  const [paddle, setPaddle] = useState<Paddle>();
  const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

  useEffect(() => {
    (async () => {
      const p = await initializePaddle({
        environment: import.meta.env.DEV ? "sandbox" : "production",
        token: undefined, // usually not needed just to open checkout
      });
      setPaddle(p);
    })();
  }, []);

  const open = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!paddle || !user) return;

    await paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      // Fix: Use userId (not user_id) and add plan/billing info for webhook
      customData: { 
        userId: user.id,
        planId: planId,
        billingCycle: billingCycle,
        source: 'centrabudget-web'
      },
      settings: { 
        displayMode: "overlay", 
        allowLogout: false 
      },
      // Add success and cancel URLs
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing?cancelled=true`,
    });
  };

  return (
    <button onClick={open} className="btn">Go Pro</button>
  );
}
