const deleteProductButtonElements = document.querySelectorAll('.product-item button');

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', async (event) => {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      alert('Something went wrong, try again later!');
      return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  });
}
