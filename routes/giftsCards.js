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

// API end point to route traffic of mygifts page
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
//Displays the gifts of a particular user, TODO: Disable remote access of request.
router.get(
    "/userid=:curruser/mygifts/limit=:lvalue&offset=:ovalue",
    (req, res) => {
        var giftsholder;
        var curruser = req.params.curruser;
        console.log(req.originalUrl);
        User.findOne({ _id: curruser })
            .then(result => {
                giftsholder = result.mygifts; // Array of gifts of the current user
            })
            .then(() => {
                if (giftsholder == null || giftsholder.length == 0) {
                    console.log("No gifts found");
                    res.status(200).send({
                        giftsdata: "No gifts found"
                    });
                } else {
                    var startpoint = req.params.ovalue; // zero
                    var howmany = req.params.lvalue; // ten
                    console.log("gift is found and it's code: ");
                    console.log(giftsholder[0].giftcode);
                    res.status(200).send({
                        giftsdata: giftsholder.splice(startpoint, howmany)
                    });
                }
            })
            .catch(err => {
                res.status(400).send("Bad request");
            });
    }
);
module.exports = router;
