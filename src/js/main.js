// Sticky Navbar

window.addEventListener("scroll", () => {
  let header = document.querySelector(".navbar-area");
  let scroll = window.scrollY;
  if (scroll > 20) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// WOW Animation

new WOW().init();


