const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Sentry = require("@sentry/node");

const apiRoutes = require("./routes");

const agenda = require("./agenda");

Sentry.init({
    dsn: "https://c4ad3326ae6d46f3a2d4e7991f160788@sentry.io/1503881"
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler()); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
apiRoutes.includeRoutes(app);
app.get("*", (req, res, next) => {
    return next({ message: "I lost!", status: 404 });
});
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
