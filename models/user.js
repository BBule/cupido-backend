var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const config = require(".././config/config");
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
    time_activated: { type: Date },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});
// UserSchema.plugin(passportLocalMongoose);
// UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt
        .sign({ _id: user._id.toHexString(), access }, config.JWT_SECRET)
        .toString();
    user.tokens.push({ access, token });
    return user.save().then(function() {
        return token;
    });
};
module.exports = mongoose.model("User", UserSchema);
