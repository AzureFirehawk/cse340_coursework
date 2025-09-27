const utilities = require(".");
const { body, validationResult } = require("express-validator");
const managementModel = require("../models/management-model");
const validate = {};

/* ***************************
 * New Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
    return [
        body("classification_name", "Classification Name Required")
            .trim()
            .isLength({ min: 1 })
            .escape(),
    ];
};