const express = require("express");
const router = express.Router();

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// Models
const User = require("../models/user");

const mycommits = require("../models/mycommits");

// API end point to route traffic of mycommits page, split into active and missed
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
// Remember the commits are refrenced
router.get(
    "/api/userid=:curruser/mycommits/limit=:lvalue&offset=:ovalue&type=:type",
    (req, res) => {
        var commitholder;
        var curruser = req.params.curruser;
        var typeofcommit = req.params.type;
        console.log(req.originalUrl);
        if (typeofcommit == "active") {
            User.findOne({ _id: curruser, "mycommits.is_active": true })
                .then(result => {
                    commitsholder = result.mycommits; // Array of commits of the current user
                })
                .then(() => {
                    if (commitsholder == null || commitsholder.length == 0) {
                        console.log("No commits found");
                        res.status(200).send({
                            commitsdata: "No commits found"
                        });
                    } else {
                        var startpoint = req.params.ovalue; // zero
                        var howmany = req.params.lvalue; // ten
                        console.log(
                            "commits is found and it's product marketprice: "
                        );
                        var commitfullholder = [];
                        // console.log(commitsholder[0].Product.marketPrice);
                        for (var i = 0; i < commitsholder.length; i++) {
                            mycommits
                                .findOne({
                                    _id: commitholder[i],
                                    is_active: true
                                })
                                .then(resultcommit => {
                                    commitfullholder.push(resultcommit);
                                });
                        }
                        if (
                            commitfullholder == null ||
                            commitfullholder.length == 0
                        ) {
                            console.log("No commits found");
                            res.status(200).send({
                                commitsdata: "No commits found"
                            });
                        }
                        res.status(200).send({
                            commitsdata: commitfullholder.splice(
                                startpoint,
                                howmany
                            )
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                });
        } else {
            User.findOne({ _id: curruser, "mycommits.is_active": false })
                .then(result => {
                    commitsholder = result.mycommits; // Array of carts of the current user
                })
                .then(() => {
                    if (commitsholder == null || commitsholder.length == 0) {
                        console.log("No commits found");
                        res.status(200).send({
                            commitsdata: "No commits found"
                        });
                    } else {
                        var startpoint = req.params.ovalue; // zero
                        var howmany = req.params.lvalue; // ten
                        console.log(
                            "commits is found and it's product marketprice: "
                        );
                        var commitfullholder = [];
                        // console.log(commitsholder[0].Product.marketPrice);
                        for (var i = 0; i < commitsholder.length; i++) {
                            mycommits
                                .findOne({
                                    _id: commitholder[i],
                                    is_active: false
                                })
                                .then(resultcommit => {
                                    commitfullholder.push(resultcommit);
                                });
                        }
                        if (
                            commitfullholder == null ||
                            commitfullholder.length == 0
                        ) {
                            console.log("No commits found");
                            res.status(200).send({
                                commitsdata: "No commits found"
                            });
                        }
                        res.status(200).send({
                            commitsdata: commitfullholder.splice(
                                startpoint,
                                howmany
                            )
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                });
        }
    }
);

module.exports = router;
