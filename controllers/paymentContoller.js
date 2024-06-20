const paymentService = require('../services/paymentService');

const createPaymentIntent = async (req, res) => {
    const { amount, email } = req.body;
    try {
        const paymentIntent = await paymentService.createPaymentIntent(amount, email);
        res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createPaymentIntent
};
