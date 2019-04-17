'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let mycommentsSchema = new Schema({
    User : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    Product : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products"
        },
        name : String,
        rating : Number,
    },
    timecreated:  {type: Date, default: Date.now},
    timeaccepted : Date,
    is_review : Boolean, // Other option being is discussion
    is_published : Boolean, // Other option being admin discretion
    commentbody : String,
    is_verified_buyer : Boolean, // is the comment maker a buyer of the product
    // This can be implemented by seeing the user's orders, if a product is found it's good.

});

module.exports = mongoose.model('mycomments', mycommentsSchema);
