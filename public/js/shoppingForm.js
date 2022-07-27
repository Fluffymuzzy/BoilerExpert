import { fetchData } from "./fetch.js";
import IMask from 'imask';
const shoppingForm = document.querySelector(".needs-validation");

const inputs = document.querySelector("#form-shopping-cart").elements;

let maskOptions = {
  mask: "+{38} (000) 000-00-00",
};
let mask = IMask(inputs[2], maskOptions);


const clearLocalStorage = () => {
  localStorage.removeItem("cart");
    setTimeout(() => {
      location.reload();
      window.location.replace("/shoppingCart");
    }, 3000);
};

shoppingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!shoppingForm.checkValidity()) {
    event.stopPropagation();
    shoppingForm.classList.add("was-validated");
    return;
  }
  fetchData("/endOfOrder", {
    method: "POST",
    body: JSON.stringify({
      userName: inputs[0].value.trim(),
      email: inputs[1].value.trim(),
      phoneNumber: inputs[2].value,
      adress: String(inputs[3].value.trim()),
      key: JSON.parse(localStorage.getItem("cart")),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response === 200) {
      Swal.fire({
        icon: "success",
      });
      clearLocalStorage();
    } else {
      Swal.fire({
        icon: "error",
      });
      clearLocalStorage();
    }
  });
});
