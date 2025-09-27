// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory_id view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to build the inventory management view
router.get("/", invController.buildManagement);

// Route to build the add classification view
router.get("/add-class", invController.buildAddClassification);

module.exports = router;