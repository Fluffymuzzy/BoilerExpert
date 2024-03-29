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
const updProductLiter = document.querySelector("#upd_item_liter");
const idOfProduct = document.querySelector(".id").innerHTML;
const updProductManufacter = document.querySelector("#upd_item_type");

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const requestBody = {
    name: updProductName.value.trim(),
    image: updateImg.value.trim(),
    cost: updProductPrice.value.trim(),
    article: updProductArticle.value.trim(),
    liter: updProductLiter.value.trim(),
    warranty: updProductWarranty.value.trim(),
    dimensions: updProductDimensions.value.trim(),
    heatingPower: updProductPower.value.trim(),
    heatingType: updProductType.value.trim(),
    type: updProductManufacter.value.trim(),
    id: Number(idOfProduct),
  };

  await fetchData("/editThisProduct", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
});
