const firstName = document.querySelector("#name");
const surname = document.querySelector("#surname");
const number = document.querySelector("#phoneNumber");
const form = document.querySelector(".needs-validation");



form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
  } else {
    fetch("/finish-callback", {
      method: "POST",
      body: JSON.stringify({
        name: firstName.value.trim(),
        surname: surname.value.trim(),
        number: Number(number.value),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      return response.text();
    }).then(function(body){
        if(body==='1'){
            console.log('done');
        }
    })
  }
});
