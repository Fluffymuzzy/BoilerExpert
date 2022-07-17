const addForm = document.querySelector(".add_form");
const addImg = document.querySelector(".add_img_input");
// const btnAddImg = document.querySelector(".upload ");
const cardWrapper = document.querySelector(".card_img");
const productName = document.querySelector("#item_name");
const productPrice = document.querySelector("#item_cost");
const productArticle = document.querySelector("#item_article");
const productWarranty = document.querySelector("#item_warranty");
const productDimensions = document.querySelector("#item_dimensions");
const productPower = document.querySelector("#item_heatingPower");
const productType = document.querySelector("#item_heatingType");







addForm.addEventListener("submit", () => {
  fetch("/admin/addingProducts/addNewProduct", {
    method: "POST",
    body: JSON.stringify({
      name: productName.value.trim(),
      cost: productPrice.value.trim(),
      image: addImg.value.trim(),
      article: productArticle.value.trim(),
      warranty: productWarranty.value.trim(),
      dimensions: productDimensions.value.trim(),
      heatingPower: productPower.value.trim(),
      heatingType: productType.value.trim(),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((body) => {
      if (body === "1") {
        alert("product is added");
      } else if (body === "0") {
        alert("some error");
      }
    });
});
