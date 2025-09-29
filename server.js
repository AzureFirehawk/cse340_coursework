/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const errorRoute = require("./routes/errorRoute")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const parser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 ************************ */
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body parser middleware
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// JWT Middleware
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Error route
app.use("/error", errorRoute)

// 404 route
app.use(async (req, res, next) => {
  next({ status: 404, message: "We lost this page, but at least we still have our car keys!" })
})

/* ************************
 * Express Error Handler
 * Place after all other middleware
 * ********************** */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  const status = err.status || 500;
  let message;
  if (status == 404) {
    message = err.message;
  } else if (status == 500) {
    message = "Looks like we have a problem. We'll get it fixed soon.";
  } else {
    message = "Oh dear, looks like something broke. Maybe try a different route?";
  }
  res.status(status).render("errors/error", {
    title: status,
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
