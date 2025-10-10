// Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const favCont = require("../controllers/favoritesController");

// Add favorite
router.post("/add", utilities.checkLogin, utilities.handleErrors(favCont.addFavorite));

// Remove favorite
router.post("/remove", utilities.checkLogin, utilities.handleErrors(favCont.removeFavorite));

// check favorites status
router.get("/status/:inv_id", utilities.checkLogin, utilities.handleErrors(favCont.checkFavoriteStatus));

// Favorites page
router.get("/", utilities.checkLogin, utilities.handleErrors(favCont.buildFavorites));

module.exports = router;