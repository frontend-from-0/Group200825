import { stripe } from '../../common/stripe';

async function handleSuccessfullCheckout(checkoutSessionId: string) {
  const checkoutSessionWithLineItems = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ['line_items'],
  })
  console.log('Checkout Session with line items:')
  console.log(checkoutSessionWithLineItems?.line_items?.data)

  // Once you get product id, use it to call Mongo and retrieve product information on our side so we can add product images to the email
  // Create order and order items, and store them in Mongo
  // Update stock on the product once a checkout session is successful
  // Trigger email to the user
}

export default {
  handleSuccessfullCheckout,
}


// Api layer (accepts request, validates req data, forwards request to the right place, returns response based on the internal logic)

// Service layer (application logic - the actual logic that handles everything behind api endpoints - business logic)

// Persistence layer (all communications with databases)
