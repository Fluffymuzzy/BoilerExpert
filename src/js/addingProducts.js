const addForm = document.querySelector(".add_form");
const addImg = document.querySelector(".add_img_input");
const addSecImg = document.querySelector(".add_second_img");
const addThirdImg = document.querySelector(".add_third_img");
const cardWrapper = document.querySelector(".card_img");
const productName = document.querySelector("#item_name");
const productPrice = document.querySelector("#item_cost");
const productArticle = document.querySelector("#item_article");
const productWarranty = document.querySelector("#item_warranty");
const productDimensions = document.querySelector("#item_dimensions");
const productPower = document.querySelector("#item_heatingPower");
const productType = document.querySelector("#item_heatingType");
const productLiter = document.querySelector("#item_liter");
const productManufacturer = document.querySelector("#item_type");

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    name: productName.value.trim(),
    cost: productPrice.value.trim(),
    image: addImg.value.trim(),
    image2: addSecImg.value.trim(),
    image3: addThirdImg.value.trim(),
    article: productArticle.value.trim(),
    type: productManufacturer.value.trim(),
    liter: productLiter.value.trim(),
    warranty: productWarranty.value.trim(),
    dimensions: productDimensions.value.trim(),
    heatingPower: productPower.value.trim(),
    heatingType: productType.value.trim(),
  };

  fetch("/adding", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((body) => {
      if (body === "1") {
        alert("Product is added");
      } else if (body === "0") {
        alert("An error occurred");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
