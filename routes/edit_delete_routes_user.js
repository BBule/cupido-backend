const express = require("express");
const authenticate=require('.././middleware/authenticate');
const router = express.Router();
var jwt = require("jsonwebtoken");

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}


// Models
const User = require("../models/user");
const Products = require("../models/Products");
const Saleslist = require("../models/saleslist");
const mycartingeneral = require("../models/mycartingeneral");
const mygifts = require("../models/mygifts");
const mycomments = require("../models/mycomments");
const mycommits = require("../models/mycommits");
const myaddresses = require("../models/myaddresses");
// const allinventory = require('../models/allinventory');
const myorders = require("../models/myorders");
const categorylist = require("../models/categorylist");
const EmailToken = require("../models/emailtoken");

router.get("/pug", function(req, res) {
    res.send("Hi");
});

// POST Route to edit address of an individual to the DB
// Edit existing address by changing the address as well as the user collection
// User cansend this route
router.post("/editaddress", authenticate, (req, res) => {
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
                    "User.username": req.body.username,
                    "User.useremail": req.body.useremail,
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
                    addresslist[i].User.username = req.body.username;
                    addresslist[i].User.useremail = req.body.useremail;
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

router.put('/api/user/update',authenticate,async function(req,res){

    if(req.body.hasOwnProperty('phone') && req.body.phone.verified==false){
        return res.status(400).send({type:'Phone',message:'Phone no. not verified'});
    }
    if(req.body.hasOwnProperty('email')){
        
         var email_token = jwt
        .sign({ _id: user._id.toHexString(), email:req.body.email.email }, config.JWT_SECRET)
        .toString();
        var verification_link='https://cupido.netlify.com/verifyemail/'+email_token;
        var emailtoken=new EmailToken({token:email_token,used:false});
        emailtoken.save();
        //send verification mail
    }
    try{
        await User.findOneAndUpdate(req.user._id,req.body);
        var user=User.findOne(req.user._id);
        res.send(user);
    }
    catch(e){
        console.log(e);
        res.status(500).send({message:'Server Error'});
    }

});

module.exports = router;
