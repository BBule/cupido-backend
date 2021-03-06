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
        category: String,
        filters: Schema.Types.Mixed
    },
    timecreated: { type: Date, default: Date.now },
    starttime: Date,
    endtime: Date,
    variant: [
        {
            label: String,
            image: String,
            salesId: String,
            productId: String
        }
    ],
    copy: { type: Boolean, default: false },
    variantLabel: String,
    // customer_emails: [Schema.Types.Mixed], // To those who have paid
    // commits_for_this_sale: [
    //     {
    //         id: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "mycommits"
    //         }
    //     }
    // ],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admins",
        required: true
    },
    referralPercent: Number,
    cupidLove: {
        quantity: Number,
        cupidLove: Number
    }, // [{quantity,cupidLove}]
    recomandation: [Schema.Types.ObjectId],
    // counter_flag_temp: { type: Number, default: ~~(Math.random() * 5) + 1 },
    quantity_committed: { type: Number, default: 0 },
    quantity_sold: { type: Number, default: 0 },
    // current_inventory: Number,
    // initial_commit_price: { type: Number, default: 0 },
    // cart_customer_emails: [Schema.Types.Mixed],
    // sale_buffer_time: Number, // in hours
    gender: Boolean, // 0 for male (Target Audience)
    // sale_visits: { type: Number, default: 5 },
    salePrice: Number
    // macho_factor: Number,
    // notif2over3: { type: Boolean, default: false },
    // notifcartlasthour: { type: Boolean, default: false },
    // notif_buy_tover4: { type: Boolean, default: false },
    // notif_buy_2tover4: { type: Boolean, default: false },
    // notif_buy_3tover4: { type: Boolean, default: false },
    // notif_buy_lasthour: { type: Boolean, default: false },
    // notif_buy_tover4_sbt: { type: Boolean, default: false },
    // notif_buy_2tover4_sbt: { type: Boolean, default: false },
    // notif_buy_3tover4_sbt: { type: Boolean, default: false },
    // notif_buy_lasthour_sbt: { type: Boolean, default: false },
    // Store user's timestamp of view along with email if it is logged in, also _id
    // userviewdata: [Schema.Types.Mixed],
    // notification_level: {
    //     type: Number,
    //     default: 0,
    //     max: 2
    // }
});

module.exports = mongoose.model("Saleslist", SalesListSchema);
