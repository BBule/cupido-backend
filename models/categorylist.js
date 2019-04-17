'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let categorySchema = new Schema({
    category_name: String,
    timecreated:  {type: Date, default: Date.now},
});

module.exports = mongoose.model('categorylist', categorySchema);
