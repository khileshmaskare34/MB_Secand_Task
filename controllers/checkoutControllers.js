// controllers/checkoutController.js

const stripe = require('../config/stripeConfig'); // Assuming you have a Stripe configuration set up

const createCheckoutSession = async (req, res) => {
    const { item, price, id } = req.body;

console.log("kkk",item, price, id)

    try {
        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item,
                        },
                        unit_amount: price * 100, // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.redirect(303, session.url); // Redirect to Stripe Checkout page
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({ error: 'Failed to create checkout session' });
    }
};

module.exports = {
    createCheckoutSession,
};
