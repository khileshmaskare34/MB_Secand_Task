const stripe = require('../config/stripeConfig');

const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        return paymentIntent;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPaymentIntent,
};
