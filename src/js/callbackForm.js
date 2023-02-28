// Define constants for frequently used DOM elements
const openCallbackFormButtons = document.querySelectorAll(".callback_btn");
const firstNameInput = document.getElementById("firstName");
const phoneNumberInput = document.getElementById("phoneNumber");

// Define HTML form as a string to be used in the Swal popup
const formHTML = `
  <div class="b"><p>Имя</p></div>
  <input id="firstName" class="swal2-input" required/>
  <div class="b"><p>Номер телефона</p></div>
  <input id="phoneNumber" class="swal2-input" type="tel" minlength="12" placeholder="+38(000)000-00-00" >
`;

// Helper function to bind an event listener to multiple elements
function bindEvent(callback, eventType, targets) {
  targets.forEach(function (target) {
    target.addEventListener(eventType, callback);
  });
}

// Define the function to be called when the openCallbackFormButtons are clicked
function openCallbackForm() {
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
        html: formHTML,
        confirmButtonText: "Оставить заявку",
        preConfirm: () => {
          // Check if both firstName and phoneNumber inputs have values
          if (firstNameInput.value && phoneNumberInput.value) {
            return [phoneNumberInput.value.trim(), firstNameInput.value.trim()];
          } else {
            Swal.showValidationMessage("Пожалуйста заполните все поля");
          }
        },
      })
        .then((result) => {
          if (result) {
            // Send a POST request to the server with the user's name and phone number
            fetch("/endCallback", {
              method: "POST",
              body: JSON.stringify({
                name: firstNameInput.value.trim(),
                number: Number(phoneNumberInput.value),
              }),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
          }
        })
        .then(() => {
          if (firstNameInput.value && phoneNumberInput.value) {
            Swal.fire({
              icon: "success",
              title: "Ожидайте звонка",
            });
          }
        });
    }
  });
}

// Attach the openCallbackForm function to each openCallbackFormButton using the bindEvent helper function
bindEvent(openCallbackForm, "click", openCallbackFormButtons);
