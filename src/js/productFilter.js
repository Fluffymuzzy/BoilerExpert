const filterBox = document.querySelectorAll(".card-box");
const filterBtns = document.querySelectorAll(".filtration-li");
const filtrationNav = document.querySelector(".filtration-nav");

filtrationNav.addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return;

  const filterClass = event.target.dataset.filter;
  filterBtns.forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");

  filterBox.forEach((box) => {
    box.classList.remove("hide");
    if (!box.classList.contains(filterClass) && filterClass !== "all") {
      box.classList.add("hide");
    }
  });
});
