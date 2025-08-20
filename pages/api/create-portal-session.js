import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { customerId } = req.body

      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' })
      }

      // Create a portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/subscription`,
      })

      res.status(200).json({ url: portalSession.url })
    } catch (err) {
      console.error('Error creating portal session:', err)
      res.status(500).json({ error: 'Failed to create portal session' })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}