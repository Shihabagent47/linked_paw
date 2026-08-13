import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { CheckoutSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = parsed.data.plan === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY!
    : process.env.STRIPE_PRICE_MONTHLY!

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, display_name')
    .eq('id', user.id)
    .single()

  let customerId: string = profile?.stripe_customer_id ?? ''
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.display_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?canceled=1`,
    subscription_data: { metadata: { supabase_user_id: user.id } },
  })

  return NextResponse.json({ url: session.url })
}
