"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categorySchema = new Schema(
    {
        category_name: String,
        category_description: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("categorylist", categorySchema);
