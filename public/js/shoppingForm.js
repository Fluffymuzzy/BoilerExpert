import { fetchData } from "./fetch.js";

const shoppingForm = document.querySelector(".needs-validation");

const inputs = document.querySelector("#form-shopping-cart").elements;

const clearLocalStorage = () => {
  localStorage.removeItem("cart");
  //   setTimeout(() => {
  //     location.reload();
  //     window.location.replace("/shoppingCart");
  //   }, 3000);
};

// shoppingForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   // console.log(event.target.elements);
//   let userName = inputs[0].value.trim(),
//     email = inputs[1].value.trim(),
//     phoneNumber = inputs[2].value.trim(),
//     adress = inputs[3].value.trim();
//   console.log(userName, email, phoneNumber, adress);

//   fetchData("/endOfOrder", {
//     method: "POST",
//     body: JSON.stringify({
//       userName: inputs[0].value.trim(),
//       email: inputs[1].value.trim(),
//       phoneNumber: inputs[2].value.trim(),
//       adress: String(inputs[3].value.trim()),
//       key: JSON.parse(localStorage.getItem("cart")),
//     }),
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     console.log(response);
//   });
// });

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
      phoneNumber: inputs[2].value.trim(),
      adress: inputs[3].value.trim(),
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

//   function (event) {
//     event.preventDefault();
//     if (!shoppingForm.checkValidity()) {
//       event.stopPropagation();
//       shoppingForm.classList.add("was-validated");
//       return;
//     }
//     fetchData("/endOfOrder", {
//       method: "POST",
//       body: JSON.stringify({
//         userName: inputs[0].value.trim(),
//         email: inputs[1].value.trim(),
//         phoneNumber: inputs[2].value.trim(),
//         adress: String(inputs[3].value.trim()),
//       }),
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     }).then((response) => {
//       if (response === 200) {
//         Swal.fire({
//           icon: "success",
//         });
//         clearLocalStorage();
//       } else {
//         Swal.fire({
//           icon: "error",
//         });
//         clearLocalStorage();
//       }
//     });
//   },
//   false
