const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.renderLogin);
router.post("/login", authController.authLogin);

router.get("/register", authController.renderRegister);
router.post("/register", authController.authRegister);

router.get("/logout", authController.authLogout);

module.exports = router;
