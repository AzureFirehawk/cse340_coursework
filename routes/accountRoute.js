// Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

// Route to build home view
router.get("/", utilities.handleErrors(accountController.buildAccount));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Post register submission
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Login Processing
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;