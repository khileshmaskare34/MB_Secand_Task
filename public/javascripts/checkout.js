document.addEventListener('DOMContentLoaded', async () => {
    const stripe = Stripe(stripePublishableKey);
    const elements = stripe.elements();
    const emailInput = document.getElementById('email');
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/confirmation',
                receipt_email: emailInput.value,
            },
        });

        if (error) {
            document.getElementById('error-message').textContent = error.message;
        }
    });
});
