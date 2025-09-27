const utilities = require(".");
const { body, validationResult } = require("express-validator");
const managementModel = require("../models/inventory-model");
const validate = {};

/* ***************************
 * New Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
    return [
        body("classification_name", "Classification Name Required")
            .trim()
            .notEmpty().withMessage("Classification name required.").bail()
            .isLength({ min: 1 }).withMessage("Classification name required.").bail()
            .matches(/^[a-zA-Z]+$/).withMessage("Please provide a valid classification name.")
            .custom(async (classification_name) => {
                const classificationExists = await managementModel.checkExistingClass(classification_name);
                if (classificationExists) {
                    throw new Error("Classification already exists.");
                }
            }).escape(),
    ];
};

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-class", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

validate.vehicleRules = () => {
    return [
        body("classification_id", "Vehicle classification required")
            .trim()
            .notEmpty().withMessage("Vehicle classification required.")
            .escape(),
        
        body("inv_make", "Vehicle make required")
            .trim()
            .notEmpty().withMessage("Vehicle make required.").bail()
            .matches(/^[a-zA-Z ]+$/).withMessage("Please provide a valid make.")
            .escape(),
        
        body("inv_model", "Vehicle model required")
            .trim()
            .notEmpty().withMessage("Vehicle model required.").bail()
            .matches(/^[a-zA-Z ]+$/).withMessage("Please provide a valid model.")
            .escape(),
        
        body("inv_year", "Vehicle year required")
            .trim()
            .notEmpty().withMessage("Vehicle year required.").bail()
            .isLength({ min: 4, max: 4 }).withMessage("Vehicle year required.").bail()
            .matches(/^[0-9]+$/).withMessage("Please provide a valid year.")
            .escape(),
        
        body("inv_color", "Vehicle color required")
            .trim()
            .notEmpty().withMessage("Vehicle color required.").bail()
            .matches(/^[a-zA-Z]+$/).withMessage("Please provide a valid color.")
            .escape(),

        body("inv_description", "Vehicle description required")
            .trim()
            .notEmpty().withMessage("Vehicle description required.").bail()
            .matches(/^[a-zA-Z0-9 ]+$/).withMessage("Please provide a valid description.")
            .escape(),
        
        body("inv_image", "Vehicle image required")
            .trim()
            .notEmpty().withMessage("Vehicle image required.")
            .matches(/^\/[A-Za-z0-9_\-/\.]+$/).withMessage("Please provide a valid image path."),

        body("inv_thumbnail", "Vehicle thumbnail required")
            .trim()
            .notEmpty().withMessage("Vehicle thumbnail required.")
            .matches(/^\/[A-Za-z0-9_\-/\.]+$/).withMessage("Please provide a valid thumbnail path."),

        body("inv_price", "Vehicle price required")
            .trim()
            .notEmpty().withMessage("Vehicle price required.").bail()
            .matches(/^\d+(\.\d{1,2})?$/).withMessage("Please provide a valid price.")
            .escape(),
        
        body("inv_miles", "Vehicle miles required")
            .trim()
            .notEmpty().withMessage("Vehicle miles required.").bail()
            .matches(/^[0-9]+$/).withMessage("Please provide a valid miles.")
            .escape(),
    ]
}

validate.checkVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_color, inv_image, inv_thumbnail, inv_price, inv_miles, inv_description, classification_id } = req.body;
    let errors = [];
    const data = await managementModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(data);
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-vehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_color,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_description,
            classification_id
        });
        return;
    }
    next();
}

module.exports = validate;