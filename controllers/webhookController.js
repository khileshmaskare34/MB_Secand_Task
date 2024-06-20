// webhookController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');

const handleStripeWebhook = async (req, res) => {
    console.log("chal raha hai")
    let event;
    
    try {
        // Verify and construct the Stripe webhook event from the request
        event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Extract relevant data from the Stripe session object
            const paymentIntentId = session.payment_intent;
            const customerEmail = session.customer_email;

            // Create a new Order instance and save it to MongoDB
            try {
                const newOrder = new Order({
                    items: session.display_items.map(item => ({
                        id: item.custom.id,
                        name: item.custom.name,
                        price: item.amount / 100,
                    })),
                    email: customerEmail,
                    paymentStatus: 'paid',
                    transactionId: paymentIntentId,
                    createdAt: new Date(),
                });

                await newOrder.save();

                console.log('Order saved successfully:', newOrder);
                res.status(200).json({ received: true });
            } catch (error) {
                console.error('Error saving order:', error);
                res.status(500).json({ error: 'Failed to save order' });
            }
            break;
        default:
            console.log(`Unhandled webhook event type: ${event.type}`);
    }

    res.status(200).end();
};

module.exports = {
    handleStripeWebhook,
};
