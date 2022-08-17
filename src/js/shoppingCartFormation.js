import {fetchData} from "./fetch.js";

let cart = {};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    addToCart(event.target);
  } else if (event.target.classList.contains("remove-from-cart")) {
    removeFromCart(event.target);
  }
});

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  ajaxGetGoodsInfo();
}

function addToCart(item) {
  let dataId = item.dataset.id;
  if (cart[dataId]) {
    cart[dataId]++;
  } else {
    cart[dataId] = 1;
  }
  console.log(1);
  ajaxGetGoodsInfo();
}

function removeFromCart(item) {
  let dataId = item.dataset.id;
  if (cart[dataId] - 1 > 0) {
    cart[dataId]--;
  } else if (cart[dataId] - 1 === 0) {
    delete cart[dataId];
  }
  ajaxGetGoodsInfo();
}

function caluclationAmount(cart) {
  let navShopAmountCart = document.querySelector(".amount_cart");
  if (navShopAmountCart == null) {
    return false;
  } else {
    let cartObj = Object.values(cart);
    let cartArr = Array.from(cartObj);
    let calcAmountItems = cartArr.reduce((x, y) => x + y, 0);
    navShopAmountCart.innerHTML = calcAmountItems;
  }
}

function ajaxGetGoodsInfo() {
  cartUpdateLocalStorage();
  fetchData("/cart", {
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
  let cartBody = document.querySelector(".cart-cards");
  let check = document.querySelector(".cart-check");
  if (cartBody == null && check == null) {
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

    let totalItemCart = "";
    let totalCart = "";

    for (let key in cart) {
      cardBody += `
      <div class="cart-card">
      <div class="cart-img">
          <img class="responsive-img rounded" src="${
            data[key]["goods_image"]
          }" />
      </div>
      <div class="cart-info">
          <h5>
           ${data[key]["goods_article"]}
          </h5>
          <div class="cart-total">
              <p class="cart-item-quantity">
                  <span>
                      <i class="bi bi-dash-lg remove-from-cart" data-id='${key}'>
                      </i>
                  </span>
                  <span>
                      <i class="bi bi-plus-lg add-to-cart" data-id='${key}'>
                      </i>
                  </span>
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
            <p>
              <b>${totalItemCart}</b>
            </p>
          </div>
      `;

    // if (totalItemCart === 0) {
    //   document.getElementById("amount_cart").style.opacity = "0%";
    // }

    cartBody.innerHTML = cardBody;
    check.innerHTML = checkBody;
  }
}

function cartUpdateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  caluclationAmount(cart);
}
