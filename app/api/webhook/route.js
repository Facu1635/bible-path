import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      // Activar suscripción
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          stripe_subscription_id: session.subscription,
          trial_ends_at: null,
        })
        .eq('user_id', userId);

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      // Notificar usuario del fallo
      console.log('Payment failed:', invoice.customer);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Configurar para recibir raw body
export const config = {
  api: {
    bodyParser: false,
  },
};