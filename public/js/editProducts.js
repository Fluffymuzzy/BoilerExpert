import { fetchData } from "./fetch.js";

const updateForm = document.querySelector(".update-form");
const updateImg = document.querySelector(".upd_img_input");
const updProductName = document.querySelector("#upd_item_name");
const updProductPrice = document.querySelector("#upd_item_cost");
const updProductArticle = document.querySelector("#upd_item_article");
const updProductWarranty = document.querySelector("#upd_item_warranty");
const updProductDimensions = document.querySelector("#upd_item_dimensions");
const updProductPower = document.querySelector("#upd_item_heatingPower");
const updProductType = document.querySelector("#upd_item_heatingType");
const updProductLiteral = document.querySelector("#upd_item_liter");
const idOfProduct = document.querySelector(".id").innerHTML;

updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchData("/admin/adminProducts/editProducts/editThisProduct", {
    method: "POST",
    body: JSON.stringify({
      name: updProductName.value.trim(),
      image: updateImg.value.trim(),
      cost: updProductPrice.value.trim(),
      article: updProductArticle.value.trim(),
      liter: productLiter.value.trim(),
      warranty: updProductWarranty.value.trim(),
      dimensions: updProductDimensions.value.trim(),
      heatingPower: updProductPower.value.trim(),
      heatingType: updProductType.value.trim(),
      id: Number(idOfProduct),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
});
