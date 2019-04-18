const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const apiRoutes = require("./routes");

const agenda = require("./agenda");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "x-auth");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,content-type, Accept , x-auth"
    );

    next();
});

apiRoutes.includeRoutes(app);

/**
 * Handle errors wisely
 *  to be able to catch error in here and processed
 * send like this: next({head:Optional,message:Error Message,status:status code})
 * this can send by default internal server error with status 500
 */
app.use((err, req, res, next) => {
    const errorObj = {
        service: "cupido_main_backend"
    };
    if (err.status === 400) {
        if (err.validationErrors) {
            errorObj.validationErrors = err.validationErrors;
        }
        errorObj.message = err.message || "Invalid Values Supplied";
        errorObj.head = err.head || null;
    } else if (err.status === 401 || err.status === 403) {
        errorObj.head = err.head || null;
        errorObj.message = err.message || "Unauthorized User";
    } else if (err.status === 500) {
        errorObj.head = err.head || null;

        errorObj.message = err.message;

        errorObj.message = "Internal Server Error";
    } else if (err.status === 404) {
        errorObj.head = err.head || null;
        errorObj.message = err.message;
    } else {
        errorObj.head = err.head || null;
        errorObj.message = err.message || "Unknown Error Occurred";
    }
    next();
    return res.status(err.status || 500).json(errorObj);
});

process.on("SIGTERM", () => {
    console.log("Stopping Wroker safely");
    agenda.stop();
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("Stopping wroker safely");
    agenda.stop();
    process.exit(0);
});

module.exports = app;
