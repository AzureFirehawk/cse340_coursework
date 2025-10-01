// Needed resources
const express = require("express");
const router = new express.Router();
const manValidate = require("../utilities/management-validation");
const utilities = require("../utilities/");
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory_id view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the inventory management view
router.get("/", invController.buildManagement);

// Route to build the add classification view
router.get("/add-class", invController.buildAddClassification);

// Route to build the add vehicle view
router.get("/add-vehicle", invController.buildAddVehicle);

// Route for management table view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build the edit vehicle view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

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

router.post("/update/", utilities.handleErrors(invController.updateVehicle))

module.exports = router;