const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Route paths
const usergetroutes = require("./routes/user_get_routes");
const userauthroutes = require("./routes/user_auth_routes");
const userpostroutes = require("./routes/user_post_routes");
//const admingetroutes =  require("./routes/admin_get_routes");
//const adminpostroutes =  require("./routes/admin_post_routes");
const cronjobs = require("./routes/cron_jobs");
const editdeleteroutesuser = require("./routes/edit_delete_routes_user");
//const editdeleteroutesadmin =  require("./routes/edit_delete_routes_admin");
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

app.use(usergetroutes);
app.use(userpostroutes);
//  app.use(admingetroutes);
// app.use(adminpostroutes);
app.use(cronjobs);
// app.use(editdeleteroutesadmin);
app.use(editdeleteroutesuser);
app.use(userauthroutes);

process.on("SIGTERM", function() {
    agenda.stop();
    process.exit(0);
});
process.on("SIGINT", function() {
    agenda.stop();
    process.exit(0);
});

module.exports = app;
