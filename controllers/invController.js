const e = require("connect-flash");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* *************************
 * Build inventory by classification view
 * ************************* */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const data = await invModel.getVehicleById(inv_id);
    const vehicle = await utilities.buildVehicle(data);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
        title: data.inv_make + " " + data.inv_model,
        nav,
        vehicle,
        errors: null
    })
}

/* *****************************
 * Return inventory by Classification as JSON
 * ***************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* *****************************
 * Build management view
 * ***************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationList,
        errors: null
    }) 
}

/* *****************************
 * Add classification view
 * ***************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-class", {
        title: "Add Classification",
        nav,
        errors: null
    }) 
}

invCont.addClass= async function (req, res, next) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    const addResult = await invModel.addClassification(classification_name);
    if (addResult) {
        req.flash("notice", "Classification added.");
        res.status(201).redirect("/inv/");
    } else {
        req.flash("notice", "Error adding classification.");
        res.status(500).redirect("/inv/add-class");
    }
} 

/* *****************************
 * Add vehicle view
 * ***************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    const data = await invModel.getClassifications();
    const classificationList = await utilities.buildClassificationList(data);
    let nav = await utilities.getNav();
    res.render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null
    }) 
}

invCont.addVehicle = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { inv_make, inv_model, inv_year, inv_color, inv_image, inv_thumbnail, inv_price, inv_miles, inv_description, classification_id } = req.body;
    const addResult = await invModel.addVehicle(inv_make, inv_model, inv_year, inv_price, inv_image, inv_thumbnail, inv_description, inv_miles, inv_color, classification_id);
    if (addResult) {
        req.flash("notice", "Vehicle added to inventory.");
        res.status(201).redirect("/inv/");
    } else {
        req.flash("notice", "Error adding vehicle.");
        res.status(500).redirect("/inv/add-vehicle");
    }
}

/* *****************************
 * Edit vehicle view
 * ***************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    const classificationList = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-vehicle", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_description: itemData.inv_description,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    }) 
}

invCont.updateVehicle = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body;
    const updateResult = await invModel.updateVehicle(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id);
    if (updateResult) {
        const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const itemName = `${inv_make} ${inv_model}`;
        const classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Sorry, the update failed.");
        res.status(501).render("inventory/edit-vehicle", {
            title: "Edit " + itemName,
            nav,
            classificationList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id
        });
    }
}

module.exports = invCont;