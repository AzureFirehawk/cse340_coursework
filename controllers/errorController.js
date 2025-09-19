const errorController = {};

/* ***************************
 * Force a server-side error
 ************************** */
errorController.throwError = (req, res, next) => {
    try {
        throw new Error("Intentional server error for testing purposes.");
    } catch (error) {
        next(error);
    }
}

module.exports = errorController;