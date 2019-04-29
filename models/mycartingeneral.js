// Basically a schema for every item in the cart for every possible sale across all users.
// This is just a data storage, the main things are embedded in the user array

"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let mycartSchema = new Schema({
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Saleslist"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        name: String,
        marketPrice: Number
    },
    timecreated: { type: Date, default: Date.now },
    is_commit: Boolean,
    price_commited_at: Number,
    quantity: { type: Number, default: 1 },
    total_expected_price: Number // price_committed_at*quantity
});

module.exports = mongoose.model("mycartingeneral", mycartSchema);
