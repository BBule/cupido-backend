"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let mycommitsSchema = new Schema({
    is_active: {
        type: Boolean,
        default: true
    }, // The commit becomes missed when even the sale buffer time has ended.
    // THis will be executed when the buffer time of some sale ends...
    // Alternatively it can be checked if the currtime is more than the sale buffer value
    gift_card_code: String, // The gift card code generated if the commit becomes missed
    Product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        // name: String,
        // marketPrice: Number,
        // emi_price: Number,
        // manufacture_warranty: Number,
        // return_policy: Number,
        // shipping_price: Number
    },
    sale: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Saleslist"
        },
            // starttime: Date,
            // endtime: Date,
            // sale_buffer_time: Number,
            // current_quantity_committed: Number,
            // price_markers: [Schema.Types.Mixed]
    },
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String
    },
    size:String,
    payment_details: [Schema.Types.Mixed],
    timecreated: { type: Date, default: Date.now },
    // commit_time: Date, // when payment portal sends positive ack
    commit_amount: { type: Number, default: 0 }, // At what amount user commited
    referralAmount:Number,
    // commit_quantity: { type: Number, default: 1 },
    // worth_coupons_applied: Number,
    // coupon_code: [Schema.Types.Mixed], // List of strings of coupon_codes applied
    // amount_paid: Number, // 10% of market price*quantity - coupons // What if coupon value is more than the price to be paid
    // final_expected_price: Number, // Multiplication of commit_amount*commit_quantity
    // estimated_delivery: [Schema.Types.Mixed], // No idea what it will have, probably just a date value
    // notification_level: {
    //     type: Number,
    //     default: 0,
    //     max: 3
    // },
    shipping_address: {
        type: Schema.Types.Mixed
    }
});

module.exports = mongoose.model("mycommits", mycommitsSchema);
