'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let legacyDBSchema = new Schema({
    is_edit : Boolean, //Other option is it may be deleted
    done_by : Boolean, // 0 for admin and 1 for user
    which_table : String, // Name of the table on which edit/delete is made
    old_details : [Schema.Types.Mixed],
    new_details : [Schema.Types.Mixed],
    Product : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products"
        },
    },
    sale : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"saleslist"
        },
    },
    User : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    timecreated:  {type: Date, default: Date.now},
});

module.exports = mongoose.model('legacyDB', legacyDBSchema);
