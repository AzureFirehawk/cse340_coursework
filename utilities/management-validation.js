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
            .notEmpty().withMessage("Classification name required.")
            .isLength({ min: 1 }).withMessage("Classification name required.")
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

module.exports = validate;