"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        category_name: String,
        category_description: String,
        addedBy: {
	      type: mongoose.Schema.Types.ObjectId,
	      ref: "Users",
	      required: true
	    },
        filters:[String]
    },
    {
        timestamps: true,
        collection: "categorylist"
    }
);

module.exports = mongoose.model("categorylist", categorySchema);
