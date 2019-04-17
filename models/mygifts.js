'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let giftsSchema = new Schema({
    is_admin_generated : Boolean,
    giftcode : String,
    discount : Number,
    timecreated:  {type: Date, default: Date.now},
    Product : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products"
        },
        name : String,
    },
    sale : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"saleslist"
        },
        starttime : Date,
        endtime : Date,
        sale_buffer_time : Number,
    },
    User : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    specificcommit : {
          id:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"mycommits"
          },
    },
});

module.exports = mongoose.model('mygifts', giftsSchema);
