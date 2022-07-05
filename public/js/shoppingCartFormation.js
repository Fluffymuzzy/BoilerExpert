const cart = {};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    addToCart(event.target.dataset.id);
  } else if (event.target.classList.contains("remove-from-cart")) {
  }
});
let productId = this.dataset.id;
function addToCart() {
  cart[productId]++;
  renderCart();
}

function removeFromCart() {
  cart[productId]--;
  renderCart();
}

function renderCart() {
  console.log(cart);
}
renderCart();
