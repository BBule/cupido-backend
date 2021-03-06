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
    size: { type: String, default: null },
    color:{ type: String, default: null },
    // referral_code:String,
    cupidCoins: { type: Number, default: 0 },
    referralAmount: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    referralList: { type: [Schema.Types.Mixed], default: [] }
    // total_expected_price: Number // price_committed_at*quantity-referral
});

module.exports = mongoose.model("mycartingeneral", mycartSchema);
