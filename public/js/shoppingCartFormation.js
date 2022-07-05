import {fetchData} from "./fetch.js";
let cart = {};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    addToCart(event.target);
  } else if (event.target.classList.contains("remove-from-cart")) {
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
  ajaxGetGoodsInfo();
}

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
  });
}

function cartUpdateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
