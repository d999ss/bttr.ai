import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { priceId, planName } = req.body

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          plan_name: planName,
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription?canceled=true`,
        customer_email: req.body.email || undefined,
      })

      res.status(200).json({ url: session.url })
    } catch (err) {
      console.error('Error creating checkout session:', err)
      res.status(500).json({ error: 'Failed to create checkout session' })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}