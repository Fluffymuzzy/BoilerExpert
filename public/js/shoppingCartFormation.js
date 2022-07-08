
import { fetchData } from "./fetch.js";
// window.onload = () => {
let cart = {};

/* Listening for a click event on the document. If the click event is on an element with the class
add-to-cart, it will call the addToCart function. If the click event is on an element with the class
remove-from-cart, it will call the removeFromCart function. */
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
    console.log(data);
    showCart(data);
  });
}

/**
 * It takes a JSON object and builds a string of HTML.
 * @param data - {
 */


function showCart(data) {
  let cartBody = document.querySelector(".cart-cards");
  let check = document.querySelector(".cart-check");

  
  if( cartBody == null && check == null )  {
    return false;
  } else {

    let cardBody = ``;
      let checkBody = `
        <div class="check-card">
          <div class="check-header">
            <h3>
              Чек
            </h3>
            <hr>
          </div>
          <div class="check-body">
          `;

      // let totalItemCart = 0;
      let totalCart = 0;

      for (let key in cart) {
        cardBody += `
      <div class="cart-card">
      <div class="cart-img">
          <img class="responsive-img rounded" src="/img/${
            data[key]["goods_image"]
          }" />
      </div>
      <div class="cart-info">
          <h4>
              <a href='/productPage/'+ value['id']=${key}'>
                  ${data[key]["goods_name"]}
              </a>
          </h4>
          <div class="cart-total">
              <p class="cart-item-quantity">
                  <span>
                      <i class="bi bi-dash-lg remove-from-cart" data-id='${key}'>
                      </i>
                  </span>
                  <span>
                      ${cart[key]}
                  </span>
                  <span>
                      <i class="bi bi-plus-lg add-to-cart" data-id='${key}'>
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

        checkBody += `
            <div class="check-description">
              <span>
                ${data[key]["goods_name"]}
              </span>
              <span>
                ${cart[key]}
              </span>
            </div>
              `;

        totalCart += cart[key] * data[key]["goods_cost"];
        totalItemCart += cart[key];
      }

      checkBody += `
          </div>
          <hr>
          <div class="check-footer">
            <h3>Итого</h3>
            <p>
              <b>${totalCart}</b>
            </p>
          </div>
      `;

  document.querySelector(".amount_cart").innerHTML = totalCart;
  // document.querySelector(".total-items").innerHTML = totalItemCart;
  cartBody.innerHTML = cardBody;
  check.innerHTML = checkBody;
    
  }       
}


/**
 * It takes the cart array and converts it to a string, then stores it in local storage.
 */
function cartUpdateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

