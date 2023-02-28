const express = require("express");
const adminController = require("../controllers/adminController");
const loginController = require("../controllers/loginController");
const router = express.Router();

// Admin login routes
router
  .route("/login")
  .get((req, res) => {
    res.render("adminLoginPage");
  })
  .post(loginController.login);

// Admin dashboard route
router.get("/admin", (req, res) => {
  res.render("adminStartPage");
});

// Admin products routes
router.get("/admin/products", (req, res) => {
  res.render("adminProducts");
});

router
  .route("/admin/products/add")
  .get((req, res) => {
    res.render("adminAddingProductsPage");
  })
  .post(adminController.addNewProduct);

router
  .route("/admin/products/edit")
  .get(adminController.editProducts)
  .post(adminController.pressEditThisProduct);

router.get("/admin/products/edit/:id", adminController.editProductById);
router.get("/deleteProduct/:id", adminController.deleteThisProduct);

// Admin callbacks routes
router
  .route("/admin/callbacks")
  .get(adminController.getCallbacks)
  .post(adminController.addCallback);

router.get("/btnResetCallback", adminController.resetCallbacks);

// Admin orders routes
router
  .route("/admin/orders")
  .get(adminController.renderAdminOrderPage)
  .delete(adminController.deleteOrders);

module.exports = router;
