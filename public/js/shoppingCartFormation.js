import { fetchData } from "./fetch.js";
let cart = {};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    addToCart(event.target);
  } else if (event.target.classList.contains("remove-from-cart")) {
    removeFromCart(event.target);
  }
});

/* Checking if there is a cart in local storage. If there is, it will parse the cart and call the
ajaxGetGoodsInfo function. */
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  ajaxGetGoodsInfo();
}

/**
 * If the item is already in the cart, increment the quantity, otherwise add it to the cart.
 * @param item - the item that was clicked on
 */
function addToCart(item) {
  let dataId = item.dataset.id;

  if (cart[dataId]) {
    cart[dataId]++;
  } else {
    cart[dataId] = 1;
  }
  ajaxGetGoodsInfo();
}

/**
 * If the item is in the cart, decrement the quantity, otherwise delete the item from the cart.
 * @param item - the button that was clicked
 */
function removeFromCart(item) {
  let dataId = item.dataset.id;

  if (cart[dataId] - 1 > 0) {
    cart[dataId]--;
  } else {
    delete cart[dataId];
  }
  ajaxGetGoodsInfo();
}

// function calculate() {
//   let cartIcon = document.getElementById("amount_cart");
//   let totalAmount = 0;
//   for (let key in cart) {
//     totalAmount += cart[key] * cart[key]["goods_cost"];
//   }
//   cartIcon.innerHTML = totalAmount;
// }

/**
 * It takes the keys of the cart object, sends them to the server, and then the server returns the data
 * associated with those keys.
 */
function ajaxGetGoodsInfo() {
  cartUpdateLocalStorage();
  fetchData("/cartTest", {
    method: "POST",
    body: JSON.stringify({ key: Object.keys(cart) }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((data) => {
    showCart(data);
  });
}

function showCart(data) {
  let cartBody = ``;
  let checkBody = `
  
  
  `;
  let totalItemInCart = 0;
  let cartAmount = 0;

  for (let key in cart) {
    cartBody += `
    <div class="cart-card">
    <div class="cart-img">
        <img class="responsive-img rounded" src="/img/${
          data[key]["goods_image"]
        }" />
    </div>
    <div class="cart-info">
        <h4>
            <a href='/productPage/:id=${key}'>
                ${data[key]["goods_name"]}
            </a>
        </h4>
        <div class="cart-total">
            <p class="cart-item-quantity">
                <span>
                    <i class="bi bi-dash-circle cart-remove" data-id='${key}'>
                    </i>
                </span>
                <span>
                    ${cart[key]}
                </span>
                <span>
                    <i class="bi bi-plus-circle cart-add" data-id='${key}'>
                    </i>
                </span>
            </p>
            <p class="cart-item-price">
                <b>
                    ${data[key]["goods_cost"] * cart[key]}
                </b>
            </p>
        </div>
    </div>
</div>
    `;

  document.querySelector(".cart-cards").innerHTML = cartBody;

  }
}





/**
 * It takes the cart array and converts it to a string, then stores it in local storage.
 */
function cartUpdateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
