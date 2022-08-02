const express = require("express");
const mainController = require("../controllers/mainController");
const router = express.Router();

router.get("/", mainController.mainPageGoods);

router.get("/catalog", mainController.catalogPage);

router.get("/catalog/product/:id", mainController.productPage);

router.get("/basket", (req, res) => {
  res.render("shoppingCart")
})

router.post("/cart", mainController.showCart);

router.post("/endOfOrder", mainController.saveDataFromCart);

module.exports = router;
