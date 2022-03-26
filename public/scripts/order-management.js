const updateOrderFormElements = document.querySelectorAll('.order-actions form');

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('_csrf');

    let response;
    try {
      response = await fetch(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _csrf: csrfToken, newStatus: newStatus })
      });
    } catch (e) {
      alert('Something went wrong - could not update order status.');
      return;
    }

    if (!response.ok) {
      alert('Something went wrong - could not update order status.');
      return;
    }

    const responseData = await response.json();
    form.parentElement.parentElement.querySelector('.badge').textContent = responseData.newStatus.toUpperCase();
  });
}
