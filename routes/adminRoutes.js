const express = require("express");
const adminController = require("../controllers/adminController");
const loginController = require("../controllers/loginController");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const conn = require("../sqlConfig");

/* A route for the admin login page. */
router.post("/login", loginController.login);

/* A route for the admin login page. */
router.route("/login").get((req, res) => {
  res.render("adminLoginPage");
});

/* This is a route for the admin start page. */
router.route("/admin").get((req, res) => {
  res.render("adminStartPage");
});

/* This is a route for the admin products page. */
router.get("/admin/products", (req, res) => {
  res.render("adminProducts");
});

/* A route for the admin adding products page. */
router.get("/admin/products/add", (req, res) => {
  res.render("adminAddingProductsPage");
});
router.post("/adding", adminController.addNewProduct);

/* A route for the admin editing products page. */
router
  .get("/admin/products/edit", adminController.editProducts)
  .post("/editThisProduct", adminController.pressEditThisProduct);

router.get("/admin/products/edit/:id", adminController.editProductById);
router.get("/deleteProduct/:id", adminController.deleteThisProduct);

/* This is a route for the admin callbacks page. */
router.get("/admin/callbacks", adminController.callbacks);
router.post("/endCallback", adminController.endCallback);
router.get("/btnResetCallback", adminController.callbackReset);

/* A route for the admin orders page. */
router.get("/admin/orders", adminController.orders);
router.get("/deleteOrders", adminController.deleteOrders);

module.exports = router;
