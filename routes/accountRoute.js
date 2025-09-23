// Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

//  Route to build account view
router.get("/account", utilities.handleErrors(accountController.buildLogin));

module.exports = router;