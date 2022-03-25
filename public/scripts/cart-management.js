const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

addToCartButtonElement.addEventListener('click', async () => {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _csrf: csrfToken,
        productId: productId
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
  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }
});
