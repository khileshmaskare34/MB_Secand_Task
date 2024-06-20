console.log("hii")
async function first(){
    console.log("pp")

    const productsContainer = document.getElementById('products');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = [];
    
    // Fetch products from server
    const response = await fetch('/products');
    const products = await response.json();

    console.log("pp", products)

    

    // Render products
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${(product.price / 100).toFixed(2)}</p>
            <button data-id="${product._id}" data-price="${product.price}">Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });


productsContainer.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting
    const formData = new FormData(event.target);
    const itemName = formData.get('item');
    const itemPrice = parseInt(formData.get('price'));
    const itemId = formData.get('id');
    cart.push({ productId: itemId, productPrice: itemPrice });
    cartCount.textContent = `Items in cart: ${cart.length}`;
});



    // Proceed to checkout
    checkoutButton.addEventListener('click', async () => {
        const email = prompt("Enter your email address:");
        const totalAmount = cart.reduce((total, item) => total + item.productPrice, 0);

        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalAmount, email }),
        });

        const { clientSecret } = await response.json();
        const stripe = Stripe('your-publishable-key');

        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: {
                    element: stripe.elements().create('card').mount('#card-element'),
                },
                billing_details: {
                    email: email,
                },
            },
        });

        if (error) {
            console.error('Payment error:', error);
        } else {
            alert('Payment successful!');
            cart = [];
            cartCount.textContent = 'Items in cart: 0';
        }
    });
}

first();