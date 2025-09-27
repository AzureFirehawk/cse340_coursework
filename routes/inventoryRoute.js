// Needed resources
const express = require("express");
const router = new express.Router();
const manValidate = require("../utilities/management-validation");
const utilities = require("../utilities/");
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory_id view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to build the inventory management view
router.get("/", invController.buildManagement);

// Route to build the add classification view
router.get("/add-class", invController.buildAddClassification);

// Route to build the add vehicle view
router.get("/add-vehicle", invController.buildAddVehicle);

// Form submissions
router.post(
    "/add-class",
    manValidate.classificationRules(),
    manValidate.checkClassData,
    utilities.handleErrors(invController.addClass)
)

router.post(
    "/add-vehicle",
    manValidate.vehicleRules(),
    manValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)

module.exports = router;