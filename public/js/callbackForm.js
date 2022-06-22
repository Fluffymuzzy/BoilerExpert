const name = document.querySelector("#name");
const number = document.querySelector("#phoneNumber");
const div = document.createElement("div");
const form = document.querySelector(".needs-validation");
div.classList.add("show_form");
console.log(div.className);

div.innerHTML = `
<div class="popup-container">
  <div class="popup-wrapper">
    form(class='col needs-validation' novalidate)
      <div class="col-md-12">
        <label class="form-label" for="name">Имя</label>
        <input class="form-control" type="text" id="name" placeholder="Имя" required="required"/>
        <div class="invalid-feedback">Пожалуйста, укажите корректно имя!</div>
      </div>
      <div class="col-md-12">
        <label class="form-label" for="phoneNumber">Номер телефона</label>
        <input class="form-control" type="tel" minlength="11" id="phoneNumber" placeholder="+38(000)000-00-00" required="required"/>
        <div class="invalid-feedback">Пожалуйста, укажите корректно номер телефона!</div>
      </div>
  </div>
</div>
`;

// function bindEvent(callback, eventType, targets) {
//   targets.forEach(function (target) {
//     target.addEventListener(eventType, callback);
//   });
// }

// const firstButton = document.querySelectorAll(".callback_btn");
// const secondButton = document.querySelectorAll(".callback_btn_two");

// bindEvent(
//   function () {
//     Swal.fire("Any fool can use a computer");
//   },
//   "click",
//   firstButton,
// );

// bindEvent(
//   function () {
//     Swal.fire("Any fool can use a computer");
//   },
//   "click",
//   secondButton
// );

document.querySelectorAll(".callback_btn").forEach((el) => {
  el.onclick = () => el.classList.toggle("show");
  Swal.fire({
    title: "Вам брякнуть?",
    icon: "question",
    html: div,
    showCloseButton: true,
    showCancelButton: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
});

// const openCallbackForm = document.querySelector(".callback_btn");
// openCallbackForm.addEventListener("click", () => {
//   Swal.fire({
//     title: "Вам брякнуть?",
//     icon: "question",
//     html: div,
//     showCloseButton: true,
//     showCancelButton: true,
//     showClass: {
//       popup: 'animate__animated animate__fadeInDown'
//     },
//     hideClass: {
//       popup: 'animate__animated animate__fadeOutUp'
//     }
//   });
// });

// div.addEventListener("submit", (event) => {
//   event.preventDefault();
//   if (!div.checkValidity()) {
//     event.stopPropagation();
//     div.classList.add("was-validated");
//   } else {
//     fetch("/finish-callback", {
//       method: "POST",
//       body: JSON.stringify({
//         name: firstName.value.trim(),
//         surname: surname.value.trim(),
//         number: Number(number.value),
//       }),
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     }).then(function (response) {
//       return response.text();
//     }).then(function(body){
//         if(body==='1'){
//             console.log('done');
//         }
//     })
//   }
// });

// function sendDataToServer() {
//   const form = document.querySelector(".needs-validation");
//   if (!form.checkValidity()) {
//     form.classList.add("was-validated");
//   } else {
//     fetch("/finish-callback", {
//       method: "POST",
//       body: JSON.stringify({
//         name: firstName.value.trim(),
//         number: Number(phoneNumber.value),
//       }),
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//       .then(function (response) {
//         return response.text();
//       })
//       .then(function (body) {
//         if (body === "1") {
//           console.log("done");
//         }
//       });
//   }
// }
