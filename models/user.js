const mongoose = require("mongoose");
const shortId = require("shortid");
// var passportLocalMongoose=require("passport-local-mongoose");

let Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema(
    {
        username: String,
        email: {
            email: { type: String, default: "" },
            verified: {
                type: Boolean,
                default: false
            }
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
            enum: ["male", "female", "Male", "Female"]
        },
        cupidCoins: {
            type: Number,
            default: 0
        },
        // googleId: String,
        // facebookId: String,
        // myorders: [Schema.Types.Mixed], //To be embedded
        mycarts: [Schema.Types.Mixed], //To be embedded
        // mycommits: [Schema.Types.Mixed], //To be referenced ["ID001","ID002"]
        // mygifts: [Schema.Types.Mixed], //To be embedded
        myaddresses: { type: [Schema.Types.Mixed], default: [] }, //To be embedded
        // mynotifications: [Schema.Types.Mixed], //To be embedded
        // refer_code: {
        //     type: String,
        //     default: shortId
        //         .generate()
        //         .toLocaleUpperCase()
        //         .replace(/[_-]/g, "")
        // },
        // referred_by: {
        //     user: { type: Schema.Types.ObjectId, ref: "Users" },
        //     code: String
        // },
        // my_referrals: [Schema.Types.ObjectId],
        lastActive: { type: Date, default: Date.now },
        profilePic:String,
        onesignalID: [{ type: String, unique: true }]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
