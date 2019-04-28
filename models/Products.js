"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ProductsSchema = new Schema(
    {
        // Static_Details
        category: String, // Watch name etc
        shortDescription: String,
        brandName: String,
        marketPrice: Number,
        emiPrice: Number,
        manufacturerWarranty: Number,
        returnTime: Number,
        ShippingPrice: Number,
        images: [String],
        backdrop_image: String,
        backdrop_title: String,
        backdrop_content: String,
        whyweloveit_image: String,
        whyweloveit_title: String,
        whyweloveit_content: String,
        brand_image: String,
        specifications_title: String,
        specifications_content: String,
        brand_title: String,
        brand_content: String,
        description: String,
        gender: Boolean, // 0 is Male
        recomandation: [Schema.Types.ObjectId],
        video: String,
        // Relevent Details
        // addedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Admins",
        //     required: true
        // },
        filters: Schema.Types.Mixed,
        timecreated: { type: Date, default: Date.now },
        title: String, // Primary Key
        likedlist: {
            meta: [Schema.Types.ObjectId],
            count: Number
        } // array of user ids, emails if possible
    },
    { collection: "products" }
);

module.exports = mongoose.model("Products", ProductsSchema);
