// Fullpage.js INITIALIZATION

let slidePage = new fullpage("#fullpage", {
  // all options here
  

  anchors: ["main", "service", "catalog", "contacts"],
  scrollingSpeed: 800,
  verticalCentered: false,
  responsiveWidth: 950,
});

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

//
