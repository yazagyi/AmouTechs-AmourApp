const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
var db = require( "../database/db.js" );
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/apikeys
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret = 'whsec_...';

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks/signatures for more information.
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const connectedAccountId = event.account;
    handleCompletedCheckoutSession(connectedAccountId, session);
  }

  response.json({received: true});
});

const handleCompletedCheckoutSession = (connectedAccountId, session) => {
  // Fulfill the purchase.
  console.log('Connected account ID: ' + connectedAccountId);
  console.log(JSON.stringify(session));
}
