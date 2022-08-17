
const filterBox = document.querySelectorAll(".card-box");
const filterBtns = document.querySelectorAll(".filtration-li");

document.querySelector(".filtration-nav").addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return false;
  let filterClass = event.target.dataset["filter"];

  filterBtns.forEach((elem) => {
    if (elem.classList.contains("selected")) elem.classList.remove("selected");
});
    event.target.classList.add("selected");

    console.log(filterBox);
    filterBox.forEach((elem) => {
        elem.classList.remove("hide");
        if (!elem.classList.contains(filterClass) && filterClass !== "all") {
          elem.classList.add("hide");
        }
        console.log(elem);
      });
});