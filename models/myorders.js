"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let myorderSchema = new Schema({
    Product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        name: String,
        marketPrice: Number,
        shipping_price: Number
    },
    sale: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "saleslist"
        },
        starttime: Date,
        endtime: Date,
        sale_buffer_time: Number,
        current_quantity_ordered: Number,
        price_markers: [Schema.Types.Mixed]
    },
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    payment_details: [Schema.Types.Mixed],
    timecreated: { type: Date, default: Date.now },
    order_time: Date, // when payment portal sends positive ack
    shipping_address: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "myaddresses"
        }
    },
    shipping_id_API: String, // Used for tracking the order
    order_status: Boolean, // When the order is reached this value should be turned to off. What we can do is to implement a system that calls the delivery API every hour and take actions on the orders which have reached.
    order_amount: Number, // At what amount the user placed the order
    order_quantity: Number,
    worth_coupons_applied: Number,
    coupon_code: [Schema.Types.Mixed], // List of strings of coupon_codes applied
    amount_paid: Number, // order_amount*quantity - coupons // What if coupon value is more than the price to be paid
    estimated_delivery: [Schema.Types.Mixed] // No idea what it will have, probably just a date value
});

module.exports = mongoose.model("myorders", myorderSchema);
