const express = require("express");

const adminController = require("../controllers/adminController");
const router = express.Router();




router.route("/")
.get((req, res) => {
  res.render("adminLoginPage");
})
.post(adminController.updateLoginHash);

module.exports = router;
