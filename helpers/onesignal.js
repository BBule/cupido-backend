const User = require("../models/user");
const moment = require("moment");

var sendNotification = function(data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require("https");
    var req = https.request(options, function(res) {
        res.on("data", function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on("error", function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};

const onesignalPost = _id => {
    User.find({ _id }).then(user => {
        var message = {
            app_id: "4ce1a56b-57ad-4e3f-b5ba-e2c128335d96",
            include_player_ids: user[0].onesignalID,
            template_id: "ebb3a508-904e-4a4b-940d-37a28ddd3d50"
        };

        sendNotification(message);

        // ORDER SHIPPED AFTER N HOURS
        let utc = moment.utc().add(24, "hours");
        const send_after = utc;
        var shippedMessage = {
            app_id: "4ce1a56b-57ad-4e3f-b5ba-e2c128335d96",
            include_player_ids: user[0].onesignalID,
            template_id: "161b26a2-0425-4012-82fa-e9259d273ca2",
            send_after
        };
        sendNotification(shippedMessage);
        console.log("ORDER PLACED BY AKASH", message);
        console.log("ORDER PLACED BY AKASH SHIPPED", shippedMessage);
    });
};

module.exports = {
    onesignalPost
};
