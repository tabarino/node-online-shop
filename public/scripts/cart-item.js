const cartItemUpdateFormElements = document.querySelectorAll('.car-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

for (const cartItemUpdateFormElement of cartItemUpdateFormElements) {
  cartItemUpdateFormElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;
    try {
      response = await fetch('/cart/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _csrf: csrfToken,
          productId: productId,
          quantity: quantity
        })
      });
    } catch (e) {
      alert('Something went wrong!');
      return;
    }

    if (!response.ok) {
      alert('Something went wrong!');
      return;
    }

    const responseData = await response.json();
    const cartData = responseData.updatedCartData;

    if (cartData.updatedItemPrice === 0) {
      form.parentElement.parentElement.remove();
    } else {
      const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
      cartItemTotalPriceElement.textContent = cartData.updatedItemPrice.toFixed(2);
    }

    cartTotalPriceElement.textContent = cartData.newTotalPrice.toFixed(2);
    for (const cartBadgeElement of cartBadgeElements) {
      cartBadgeElement.textContent = cartData.newTotalQuantity;
    }
  });
}
