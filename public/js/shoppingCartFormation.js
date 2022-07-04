let cart = {};

document.querySelector(".add-to-cart").forEach((element) => {
  element.onclick = addToCart;
});

function addToCart() {
  // let goodsId = this.dataset.id;
  console.log("1");
}

// if (localStorage.getItem("cart")) {
//   cart = JSON.parse(localStorage.getItem("cart"));
//   ajaxGetGoodsInfo();
// }

// function addToCart() {
//   let goodsId = this.dataset.id;

//   if (cart[goodsId]) {
//     cart[goodsId]++;
//   } else {
//     cart[goodsId] = 1;
//   }
//   console.log("1");
//   ajaxGetGoodsInfo();

// }

