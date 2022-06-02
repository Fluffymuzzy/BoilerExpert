// Fullpage.js INITIALIZATION

let slidePage = new fullpage("#fullpage", {
  scrollingSpeed: 800,
  verticalCentered: false,
  responsiveWidth: 950,
});

// PARALLAX

fullpage_api.parallax.setOption("type", "cover");

fullpage_api.parallax.setOption("percentage", "62");

fullpage_api.parallax.init();

// HEADER STICKY
window.onscroll = function () {
  myFunction();
};

let header = document.getElementById("myHeader");

// Get the offset position of the navbar
let sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
