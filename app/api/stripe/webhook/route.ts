import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'

function periodEnd(sub: Stripe.Subscription): string | null {
  const ts = sub.billing_schedules?.[0]?.bill_until?.computed_timestamp
  return ts ? new Date(ts * 1000).toISOString() : null
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription' || !session.subscription) break

        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        const userId = sub.metadata.supabase_user_id
        if (!userId) break

        await Promise.all([
          supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: sub.id,
            stripe_price_id: sub.items.data[0].price.id,
            status: sub.status,
            current_period_end: periodEnd(sub),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' }),
          supabase.from('profiles').update({ is_alpha: true }).eq('id', userId),
        ])
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata.supabase_user_id
        if (!userId) break

        const isActive = sub.status === 'active' || sub.status === 'trialing'
        await Promise.all([
          supabase.from('subscriptions').update({
            stripe_price_id: sub.items.data[0].price.id,
            status: sub.status,
            current_period_end: periodEnd(sub),
            updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', sub.id),
          supabase.from('profiles').update({ is_alpha: isActive }).eq('id', userId),
        ])
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata.supabase_user_id
        if (!userId) break

        await Promise.all([
          supabase.from('subscriptions').update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', sub.id),
          supabase.from('profiles').update({ is_alpha: false }).eq('id', userId),
        ])
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
