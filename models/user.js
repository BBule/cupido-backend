const mongoose = require("mongoose");

// var passportLocalMongoose=require("passport-local-mongoose");

let Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: String,
    email: {
        email: String,
        verified: Boolean
    },
    contact: {
        contact: Number,
        verified: Boolean
    },
    notif_subscribe: {
        type: Boolean,
        default: true
    },
    googleId: String,
    facebookId: String,
    myorders: [Schema.Types.Mixed], //To be embedded
    mycarts: [Schema.Types.Mixed], //To be embedded
    mycommits: [Schema.Types.Mixed], //To be referenced ["ID001","ID002"]
    mygifts: [Schema.Types.Mixed], //To be embedded
    myaddresses: [Schema.Types.Mixed], //To be embedded
    mynotifications: [Schema.Types.Mixed], //To be embedded
    time_created: { type: Date, default: Date.now },
    time_activated: { type: Date }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
