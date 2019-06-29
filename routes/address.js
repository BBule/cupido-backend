const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const myaddresses = require("../models/myaddresses");

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// POST Route to edit address of an individual to the DB
// Edit existing address by changing the address as well as the user collection
// User cansend this route

router.post("/edit", (req, res, next) => {
    console.log("Editing address of the user");
    let curruserid = mongoose.Types.ObjectId(req.user._id);
    // let addressid = mongoose.Types.ObjectId(req.body.addressid);
    // const a = myaddresses
    //     .findOneAndUpdate(
    //         { _id: addressid },
    //         {
    //             $set: {
    //                 User: {
    //                     id: curruserid,
    //                     username: req.user.username,
    //                     useremail: req.body.useremail
    //                         ? req.body.useremail
    //                         : req.user.email
    //                         ? req.user.email.email
    //                         : "",
    //                     contact: req.body.contact,
    //                     address: req.body.address,
    //                     landmark: req.body.landmark,
    //                     city: req.body.city,
    //                     state: req.body.state,
    //                     country: req.body.country
    //                 }
    //             }
    //         },
    //         { new: true }
    //     )
    //     .exec();
    // const b = 
    User.updateOne(
        {
            "myaddresses.city":req.body.city
        },
        {
            $set: {
                "myaddresses.$.contact":req.body.contact,
                "myaddresses.$.state":req.body.state,
                "myaddresses.$.address":req.body.address,
                "myaddresses.$.landmark":req.body.landmark,
                "myaddresses.$.country":req.body.country
            }
        }
    ).exec()
    // return Promise.all([a, b])
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            console.log(error);
            return next({
                message: "unable to update, please try again later!",
                status: 400,
                stack: error
            });
        });
});

// API end point to route traffic of my addresses page
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
//Displays the addresses of a particular user, TODO: Disable remote access of request.
router.get("/", (req, res, next) => {
    var addressholder;
    User.findOne({ _id: req.user._id })
        .select("myaddresses")
        .then(result => {
            addressholder = result.myaddresses; // Array of addresses of the current user
        })
        .then(() => {
            if (addressholder == null || addressholder.length == 0) {
                console.log("No addresses found");
                return res.send({
                    addressdata: []
                });
            } else {
                // var startpoint = req.query.offset; // zero
                // var howmany = req.query.limit; // ten
                // console.log("Address is found and it's city: ");
                // console.log(addressholder[0].city);
                return res.json({
                    addressdata: addressholder //.splice(startpoint, howmany)
                });
            }
        })
        .catch(err => {
            return next({
                message: err.message || "unknown error",
                status: 400,
                stack: err
            });
        });
});

// POST Route to add address of an individual to the DB
// Create a new object and then embed data into the array
// User can send this route
router.post("/add", (req, res) => {
    console.log("Posting address to the user");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    let newaddress = {
        contact: req.body.contact,
        address: req.body.address,
        landmark: req.body.landmark,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
    }

            User.findOneAndUpdate(
                { _id: curruser._id },
                { $push: {myaddresses: newaddress } }
            )
                .then(() => {
                    return res.json({
                        newaddress
                    });
                })
                .catch(err => {
                    return next({
                        message: err.message || "unknown error",
                        status: 400,
                        stack: err
                    });
                })
        
});

router.post("/remove", (req, res, next) => {
    if (!req.body.addressId) {
        return next({
            message: "please pass all the required elements",
            status: 400
        });
    }
    // const a = 
    User.findOneAndUpdate(
        {
            _id: req.user._id,
            "myaddresses._id": mongoose.Types.ObjectId(req.body.addressId)
        },
        {
            $pull: {
                myaddresses: {
                    _id: mongoose.Types.ObjectId(req.body.addressId)
                }
            }
        },
        { new: true }
    ).exec()
    // const b = myaddresses
    //     .findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.body.addressId) })
    //     .exec();
    // return Promise.all([a, b])
        .then(data => {
            return res.json(data[0]);
        })
        .catch(error => {
            return next({
                message: "unable to delete address",
                status: 400,
                stack: error
            });
        });
});

module.exports = router;
