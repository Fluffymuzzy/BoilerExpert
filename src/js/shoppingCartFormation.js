import { fetchData } from "./fetch.js";

const cart = JSON.parse(localStorage.getItem("cart")) || {};

const addToCart = (item) => {
  const dataId = item.dataset.id;
  cart[dataId] = (cart[dataId] || 0) + 1;
  ajaxGetGoodsInfo();
};

const removeFromCart = (item) => {
  const dataId = item.dataset.id;
  if (cart[dataId] > 1) {
    cart[dataId] -= 1;
  } else {
    delete cart[dataId];
  }
  ajaxGetGoodsInfo();
};

const calculateAmount = () => {
  const navShopAmountCart = document.querySelector(".amount_cart");
  if (!navShopAmountCart) return;
  const cartArr = Object.values(cart);
  const calcAmountItems = cartArr.reduce((acc, val) => acc + val, 0);
  navShopAmountCart.innerHTML = calcAmountItems;
};

const ajaxGetGoodsInfo = () => {
  cartUpdateLocalStorage();
  fetchData("/cart", {
    method: "POST",
    body: JSON.stringify({ key: Object.keys(cart) }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(showCart);
};

const showCart = (data) => {
  const cartBody = document.querySelector(".cart-cards");
  const check = document.querySelector(".cart-check");
  if (!cartBody || !check) return;

  let cardBody = "";
  let checkBody = `
    <div class="check-card">
      <div class="check-header">
        <h3>Чек</h3>
        <hr>
      </div>
      <div class="check-body">
  `;
  let totalCart = 0;
  let totalItemCart = 0;

  for (const key in cart) {
    const item = data[key];
    if (!item) continue;
    const { goods_article, goods_image, goods_name, goods_cost } = item;
    const quantity = cart[key];
    const itemTotalCost = goods_cost * quantity;

    cardBody += `
      <div class="cart-card">
        <div class="cart-img">
          <img class="responsive-img rounded" src="${goods_image}" />
        </div>
        <div class="cart-info">
          <h5>${goods_article}</h5>
          <div class="cart-total">
            <p class="cart-item-quantity">
              <span>
                <i class="bi bi-dash-lg remove-from-cart" data-id="${key}"></i>
              </span>
              <span>
                <i class="bi bi-plus-lg add-to-cart" data-id="${key}"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    `;

    checkBody += `
      <div class="check-description">
        <span>${goods_name}</span>
        <span>${quantity}</span>
      </div>
    `;

    totalCart += itemTotalCost;
    totalItemCart += quantity;
  }

  checkBody += `
      </div>
      <hr>
      <div class="check-footer">
        <h3>Итого</h3>
        <p><b>${totalCart}</b></p>
        <p><b>${totalItemCart}</b></p>
      </div>
    </div>
  `;

  cartBody.innerHTML = cardBody;
  check.innerHTML = checkBody;
  calculateAmount();
};
