const express = require("express");
const mainPageProducts = require("../server/get/mainPageFiles");
const catalog = require("../server/get/catalogPage");
const product = require("../server/get/productPage");
const showCart = require("../server/post/showCart");
const router = express.Router();

router.route("/").get((req, res) => {
  mainPageProducts(req, res, "main");
});

router.route("/catalog").get((req, res) => {
  catalog(req, res, "catalogPage");
});

router.route("/catalog/product/:id").get((req, res) => {
  product(req, res, "productPage");
});

router.route("/cart").post((req, res) => {
  showCart(req, res);
});

router.route("/endOfOrder").post((req, res) => {
    
  });
module.exports = router;
