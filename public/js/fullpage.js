// Fullpage.js INITIALIZATION
let fullPage = new fullpage("#fullpage", {
  //options here
  autoScrolling: true,
  anchors: ["home", "services", "excellence", "catalog"],
  menu: "#main-nav",
  navigation: true,
  navigationTooltips: [
    "Главная",
    "Наши услуги",
    "Наши преимущества",
    "Каталог",
  ],
  showActiveTooltip: true,
  slidesNavPosition: top,
  css3: true,
});


