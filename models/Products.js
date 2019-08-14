"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ProductsSchema = new Schema(
    {
        // Static_Details
        category: String, // Watch name etc
        // shortDescription: String,
        brandName: String,
        marketPrice: Number,
        // emiPrice: Number,
        // manufacturerWarranty: Number,
        // returnTime: Number,
        // ShippingPrice: Number,
        images: [String],
        productCatalogImage:String,
        highlights:[String],
        backdrop_image: Array,
        backdrop_title: String,
        backdrop_content: String,
        whyweloveit_image: Array,
        whyweloveit_title: String,
        whyweloveit_content: String,
        brand_image: Array,
        size:[String],
        sizeChart:String,
        // specifications_title: String,
        // specifications_content: String,
        brand_title: String,
        brand_content: String,
        // description: String,
        gender: Boolean, // 0 is Male
        // recommendation: [Schema.Types.ObjectId],
        featuresAtGlance: [{ title: String, icon: String }],
        avrg_rating: { type: Number, default: 2.5 },
        video: String,
        subCategory:String,
        productModel:Number,
        productVariant:String,
        // Relevent Details
        // addedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Admins",
        //     required: true
        // },
        filters: Schema.Types.Mixed,
        timecreated: { type: Date, default: Date.now },
        title: String, // Primary Key
        // likedlist: {
        //     meta: [Schema.Types.ObjectId],
        //     count: Number
        // } // array of user ids, emails if possible
    },
    { collection: "products" }
);

module.exports = mongoose.model("Products", ProductsSchema);
