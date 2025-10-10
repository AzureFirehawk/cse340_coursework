const e = require("connect-flash");
const favModel = require("../models/favorites-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const favCont = {};

// Add vehicle to favorites
favCont.addFavorite = async function (req, res, next) {
    try {
        const account_id = res.locals.accountData.account_id;
        const inv_id = parseInt(req.body.inv_id);
        await favModel.addFavorite(account_id, inv_id);
        return res.json({ success: true, message: "Vehicle added to favorites." });
    } catch (error) {
        console.error("Error adding vehicle to favorites: " + error);
        return res.status(500).json({ success: false, message: "Error adding vehicle to favorites." });
    }
}

// Remove vehicle from favorites
favCont.removeFavorite = async function (req, res, next) {
    try {
        const account_id = res.locals.accountData.account_id;
        const inv_id = parseInt(req.body.inv_id);
        await favModel.removeFavorite(account_id, inv_id);
        return res.json({ success: true, message: "Vehicle removed from favorites." });
    } catch (error) {
        console.error("Error removing vehicle from favorites: " + error);
        return res.status(500).json({ success: false, message: "Error removing vehicle from favorites." });
    }
}

favCont.buildFavorites = async function (req, res, next) {
    try {
        const account_id = res.locals.accountData.account_id;
        const favorites = await favModel.getFavoritesByAccountId(account_id);
        const favGrid = await utilities.buildClassificationGrid(favorites);
        const nav = await utilities.getNav();
        res.render("account/favorites", {
            title: "My Favorites",
            nav,
            favorites: favGrid,
            errors: null
        });
    } catch (error) {
        console.error("Error retrieving favorites: " + error);
        next(error);
    }
}

favCont.checkFavoriteStatus = async function (account_id, inv_id) {
    try {
        const isFavorite = await favModel.checkFavoriteStatus(account_id, inv_id);
        return isFavorite;
    } catch (error) {
        console.error("Error checking favorite status: " + error);
        throw error;
    }
}

module.exports = favCont;