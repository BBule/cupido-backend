"use strict";

module.exports = {
    paypal: {
        businessEmail: "",
        url: "https://www.sandbox.paypal.com/cgi-bin/webscr",
        currency: "INR"
    },
    secret: "",
    name: "nodeStore",
    db: {
        url: "mongodb://getlow:lowerlowest1@ds131721.mlab.com:31721/getlow",
        //url:"mongodb://localhost:27017/amazon",
        sessions: "sessions"
    },
    locale: {
        lang: "en-US",
        currency: "INR"
    }
};
