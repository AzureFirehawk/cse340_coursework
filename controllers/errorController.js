const errorController = {};

/* ***************************
 * Force a server-side error
 ************************** */
errorController.throwError = (req, res, next) => {
    const result = nonexistentFunction();
    res.send(result);
}

module.exports = errorController;