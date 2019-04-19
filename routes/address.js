const express = require("express");
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
    let curruserid = req.user._id;
    let addressid = req.body.addressid;
    // Edit the address DB
    myaddresses
        .findOneAndUpdate(
            { _id: addressid },
            {
                $set: {
                    "User.id": curruserid,
                    "User.username": req.user.username,
                    "User.useremail": req.body.email
                        ? req.body.email
                        : req.user.email
                        ? req.user.email.email
                        : "",
                    "User.contact": req.body.contact,
                    "User.address": req.body.address,
                    "User.landmark": req.body.landmark,
                    "User.city": req.body.city,
                    "User.state": req.body.state,
                    "User.country": req.body.country,
                    timecreated: newIndDate()
                }
            },
            { new: true }
        )
        .then(addressdoc => {
            console.log(addressdoc);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("Error occured");
        });
    // Make changes in the USER DB
    let addresslist = [];
    var flag = false;
    User.findOne({ _id: curruserid }, function(err, docuser) {
        console.log("User found");
        if (docuser != null && docuser.length != 0) {
            addresslist = docuser.myaddresses;
            for (var i = 0; i < addresslist.length; i++) {
                console.log("Searching addresses");
                console.log("Comparing : ");
                console.log(addressid);
                console.log(addresslist[i]._id);
                if (addresslist[i]._id == addressid) {
                    console.log("Address found");
                    addresslist[i].User.id = curruserid;
                    addresslist[i].User.username = req.user.username;
                    addresslist[i].User.useremail = req.body.email
                        ? req.body.email
                        : req.user.email
                        ? req.user.email.email
                        : "";
                    addresslist[i].User.contact = req.body.contact;
                    addresslist[i].User.address = req.body.address;
                    addresslist[i].User.landmark = req.body.landmark;
                    addresslist[i].User.city = req.body.city;
                    addresslist[i].User.state = req.body.state;
                    addresslist[i].User.country = req.body.country;
                    console.log("New address list : ");
                    console.log(addresslist);
                    flag = true;
                    break;
                }
            }
        } else {
            console.log("DOcuser incompat");
            console.log(docuser);
        }
    }).then(() => {
        if (flag == true) {
            console.log("User is being updated");
            User.findOneAndUpdate(
                { _id: curruserid },
                {
                    $set: {
                        myaddresses: addresslist
                    }
                },
                { new: true }
            )
                .then(userdoc => {
                    console.log(userdoc);
                    res.status(200).send("User doc was updated");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Error occured 2");
                });
        } else {
            console.log("No address match found");
            res.status(200).send("No address match found");
        }
    });
});

// API end point to route traffic of my addresses page
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
//Displays the addresses of a particular user, TODO: Disable remote access of request.
router.get("/limit=:lvalue&offset=:ovalue", (req, res, next) => {
    var addressholder;
    User.findOne({ _id: req.user._id })
        .select("myaddresses")
        .then(result => {
            addressholder = result.myaddresses; // Array of addresses of the current user
        })
        .then(() => {
            if (addressholder == null || addressholder.length == 0) {
                console.log("No addresses found");
                res.status(200).send({
                    addressdata: "No addresses found"
                });
            } else {
                var startpoint = req.params.ovalue; // zero
                var howmany = req.params.lvalue; // ten
                console.log("Address is found and it's city: ");
                console.log(addressholder[0].city);
                return res.json({
                    addressdata: addressholder.splice(startpoint, howmany)
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
    let newaddress = new myaddresses({
        "User.id": curruser._id,
        "User.username": req.user.username,
        "User.useremail": req.body.email
            ? req.body.email
            : req.user.email
            ? req.user.email.email
            : "",
        "User.contact": req.body.contact,
        "User.address": req.body.address,
        "User.landmark": req.body.landmark,
        "User.city": req.body.city,
        "User.state": req.body.state,
        "User.country": req.body.country
    });
    newaddress
        .save()
        .then(() =>
            User.findOneAndUpdate(
                { _id: curruser._id },
                { $push: { myaddresses: newaddress } }
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
        )
        .catch(err => {
            return next({
                message: err.message || "unknown error",
                status: 400,
                stack: err
            });
        });
});

module.exports = router;
