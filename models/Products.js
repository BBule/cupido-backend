"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ProductsSchema = new Schema(
    {
        // Static_Details
        Category: String, // Watch name etc
        shortDescription: String,
        brandName: String,
        marketPrice: Number,
        emiPrice: Number,
        manufacturerWarranty: Number,
        returnTime: Number,
        ShippingPrice: Number,
        image_url1: String,
        image_url2: String,
        image_url3: String,
        image_url4: String,
        backdrop_title: String,
        backdrop_content: String,
        whyweloveit_title: String,
        whyweloveit_content: String,
        specifications_title: String,
        specifications_content: String,
        brand_title: String,
        brand_content: String,
        description: String,
        gender: Boolean, // 0 is Male
        // Relevent Details
        timecreated: { type: Date, default: Date.now },
        title: String, // Primary Key
        likedlist: {
        meta:[Schema.Types.ObjectId],
        count:Number} // array of user ids, emails if possible
    },
    { collection: "products" }
);

module.exports = mongoose.model("Products", ProductsSchema);
