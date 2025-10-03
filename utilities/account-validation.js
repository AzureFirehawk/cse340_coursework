const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* *********************************
 * Registration Data Validation Rules
 * ******************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // Message sent on error
        
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // Message sent on error
        
        // Valid email is required and cannot already exist in DB
        body("account_email")
            .trim()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.") // Message sent on error
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists) {
                    throw new Error("Email already in use. Please log in or use a different email.");
                }
            }),
        
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

validate.loginRules = () => {
    return [
        // Valid email is required
        body("account_email")
            .trim()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.") // Message sent on error
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (!emailExists) {
                    throw new Error("Email does not exist. Please register.");
                }
            }),
        
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a first name."), // Message sent on error
        
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a last name."), // Message sent on error
        
        // Valid email is required and cannot already exist in DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.") // Message sent on error
    ]
}

validate.passwordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/register", {
            errors,
            title: "Register",
            nav, 
            account_firstname,
            account_lastname,
            account_email,
        });
        return
    }
    next();
}

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/login", {
            errors,
            title: "Login",
            nav, 
            account_email,
        });
        return
    }
    next();
}

validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav, 
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        });
        return
    }
    next();
}

validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav, 
            account_id,
        });
        return
    }
    next();
}

module.exports = validate