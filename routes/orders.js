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

// API end point to route traffic of myorders page
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
//order of a user
router.get(
    "/api/userid=:curruser/myorders/limit=:lvalue&offset=:ovalue",
    (req, res) => {
        var ordersholder;
        var curruser = req.params.curruser;
        console.log(req.originalUrl);
        User.findOne({ _id: curruser })
            .then(result => {
                ordersholder = result.myorders; // Array of orders of the current user
            })
            .then(() => {
                if (ordersholder == null || ordersholder.length == 0) {
                    console.log("No orders found");
                    res.status(200).send({
                        ordersdata: "No orders found"
                    });
                } else {
                    var startpoint = req.params.ovalue; // zero
                    var howmany = req.params.lvalue; // ten
                    console.log("order is found and it's amount: ");
                    console.log(ordersholder[0].order_amount);
                    res.status(200).send({
                        ordersdata: ordersholder.splice(startpoint, howmany)
                    });
                }
            })
            .catch(err => {
                res.status(400).send("Bad request");
            });
    }
);
module.exports = router;
