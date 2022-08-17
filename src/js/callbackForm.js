const openCallbackFormButton = document.querySelectorAll(".callback_btn");
const form = `<div class='b'><p>Имя</p></div><input id='firstName' class='swal2-input' required/><div class='b'><p>Номер телефона</p></div><input id='phoneNumber' class='swal2-input' type='tel' minlength='12' placeholder='+38(000)000-00-00' >`;

function bindEvent(callback, eventType, targets) {
  targets.forEach(function (target) {
    target.addEventListener(eventType, callback);
  });
}
bindEvent(
  function openForm() {
    Swal.fire({
      title: "Хотите оставить заявку на ремонт?",
      icon: "question",
      timerProgressBar: true,
      showCloseButton: true,
      confirmButtonText: "Да",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      console.log("result.value", result.value);

      if (result.value) {
        Swal.fire({
          title: "Представьтесь и оставьте ваш номер телефона",
          icon: "question",
          showCloseButton: true,
          html: form,
          confirmButtonText: "Оставить заявку",
          preConfirm: () => {
            if (
              document.getElementById("firstName").value &&
              document.getElementById("phoneNumber").value
            ) {
              return [
                document.getElementById("phoneNumber").value,
                document.getElementById("firstName").value,
              ];
            } else {
              Swal.showValidationMessage("Пожалуйста заполните все поля");
            }
          },
        })
          .then((result) => {
            if (result) {
              fetch("/endCallback", {
                method: "POST",
                body: JSON.stringify({
                  name: firstName.value.trim(),
                  number: Number(phoneNumber.value),
                }),
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              });
            }
          })
          .then(() => {
            if (firstName.value && phoneNumber.value) {
              Swal.fire({
                icon: "success",
                title: "Ожидайте звонка",
              });
            }
          });
      }
    });
  },
  "click",
  openCallbackFormButton
);
