const mongoose = require("mongoose");
const shortId = require("shortid");
// var passportLocalMongoose=require("passport-local-mongoose");

let Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema(
    {
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
        gender: {
            type: String,
            enum: ["Male", "Female"]
        },
        googleId: String,
        facebookId: String,
        myorders: [Schema.Types.Mixed], //To be embedded
        mycarts: [Schema.Types.Mixed], //To be embedded
        mycommits: [Schema.Types.Mixed], //To be referenced ["ID001","ID002"]
        mygifts: [Schema.Types.Mixed], //To be embedded
        myaddresses: [Schema.Types.Mixed], //To be embedded
        mynotifications: [Schema.Types.Mixed], //To be embedded
        refer_code: {
            type: String,
            default: shortId
                .generate()
                .toLocaleUpperCase()
                .replace(/[_-]/g, "")
        },
        referred_by: {
            user: { type: Schema.Types.ObjectId, ref: "Users" },
            code: String
        },
        my_referrals: [Schema.Types.ObjectId],
        time_activated: { type: Date }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
