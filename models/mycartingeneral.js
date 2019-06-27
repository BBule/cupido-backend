// Basically a schema for every item in the cart for every possible sale across all users.
// This is just a data storage, the main things are embedded in the user array

"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let mycartSchema = new Schema({
    sale: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Saleslist"
        }
    },
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    Product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        name: String,
        salePrice: Number
    },
    timecreated: { type: Date, default: Date.now },
    is_commit: Boolean,
    // referral_code:String,                     //cbr
    cupidCoins: Number,
    // referralCupidCoins:Number,                    //cbr
    quantity: { type: Number, default: 1 },
    // total_expected_price: Number // price_committed_at*quantity-referral                   //cbr
});

module.exports = mongoose.model("mycartingeneral", mycartSchema);
