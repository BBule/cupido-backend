"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let blogPostSchema = new Schema(
    {
        topic: { type: String },
        title: { type: String, required: true },
        body: { type: String, required: true }, //make sure its a markdown
        time_to_read: { type: Number, required: true }, //in minutes
        author: {
            name: String,
            avatar: String
        },
        cover_photo: { type: String, required: true },
        popularity_hits: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("blogPost", blogPostSchema);
