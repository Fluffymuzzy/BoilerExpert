// const name = document.querySelector("#name");
// const surname = document.querySelector("#surname");
// const number = document.querySelector("#phoneNumber");
const forms = document.querySelector(".needs-validation");

const form = document.createElement("form");
form.innerHTML = `
<div class="popup-container">
  <div class="popup-wrapper">
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

/* It's a function that opens a modal window with a form. */
const openCallbackForm = document.querySelector(".callback-btn");
openCallbackForm.addEventListener("click", function () {
  swal({
    title: "Вам брякнуть?",
    icon: "",
    content: form,
    buttons: {
      cancel: {
        text: "Cancel",
        value: null,
        visible: true,
        className: "",
        closeModal: true,
      },
      confirm: {
        text: "OK",
        value: true,
        visible: true,
        className: "",
        closeModal: false,
      },
    },
  }).then((confirm) => {
    if (confirm) {
        // ???
    }
    else {
        // ???
    }
});
});
