"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let SalesListSchema = new Schema({
    product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        marketPrice: Number,
        ShippingPrice: Number,
        title: String,
        brandName: String,
        category: String
    },
    timecreated: { type: Date, default: Date.now },
    starttime: Date,
    endtime: Date,
    customer_emails: [Schema.Types.Mixed], // To those who have paid
    commits_for_this_sale: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "mycommits"
            }
        }
    ],
    pricemarkers: [Schema.Types.Mixed], // [{quantity,price}]
    quantity_committed: { type: Number, default: 0 },
    quantity_sold: { type: Number, default: 0 },
    current_inventory: Number,
    cart_customer_emails: [Schema.Types.Mixed],
    sale_buffer_time: Number, // in hours
    gender: Boolean, // 0 for male (Target Audience)
    sale_visits: { type: Number, default: 5 },
    macho_factor: Number,
    notif2over3: { type: Boolean, default: false },
    notifcartlasthour: { type: Boolean, default: false },
    notif_buy_tover4: { type: Boolean, default: false },
    notif_buy_2tover4: { type: Boolean, default: false },
    notif_buy_3tover4: { type: Boolean, default: false },
    notif_buy_lasthour: { type: Boolean, default: false },
    notif_buy_tover4_sbt: { type: Boolean, default: false },
    notif_buy_2tover4_sbt: { type: Boolean, default: false },
    notif_buy_3tover4_sbt: { type: Boolean, default: false },
    notif_buy_lasthour_sbt: { type: Boolean, default: false },
    // Store user's timestamp of view along with email if it is logged in, also _id
    userviewdata: [Schema.Types.Mixed],
    notification_level: {
        type: Number,
        default: 0,
        max: 2
    }
});

module.exports = mongoose.model("Saleslist", SalesListSchema);
