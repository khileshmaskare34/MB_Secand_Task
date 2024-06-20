const stripe = require('../config/stripeConfig');

const createPaymentIntent = async (amount, email) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            receipt_email: email
        });
        return paymentIntent;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPaymentIntent
};
