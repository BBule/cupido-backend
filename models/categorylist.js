"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        category_name: String,
        category_description: String
    },
    {
        timestamps: true,
        collection: "categorylist"
    }
);

module.exports = mongoose.model("categorylist", categorySchema);
