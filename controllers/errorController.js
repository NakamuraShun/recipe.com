const httpStatus = require("http-status-codes");

module.exports = {
    respond404: (req, res) =>
    {
        let errorCode = httpStatus.NOT_FOUND;
        res.status(errorCode);
        res.render("404");
    },

    respond500: (error, req, res, next) =>
    {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.log(`ERRORoccurred:${error.stack}`)
        res.status(errorCode);
        res.render("500");
    }
}

