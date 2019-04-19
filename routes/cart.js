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

const mycartingeneral = require("../models/mycartingeneral");
const SalesList = require("../models/saleslist");

// POST Route to send cart entry of an individual
// Create a new object and then embed data into the array
// User can send this route
router.post("/add", (req, res) => {
    console.log("Posting cart data to the DB");
    let curruser = req.user;
    let newcartitem = new mycartingeneral({
        "User.id": curruser._id,
        "Product.id": req.body.productid,
        "Product.name": req.body.productname,
        "Product.marketPrice": req.body.marketPrice,
        "sale.id": req.body.saleid,
        timecreated: newIndDate(),
        is_commit: req.body.iscommit,
        price_committed_at: req.body.price_committed_at,
        quantity: req.body.quantity,
        total_expected_price: req.body.price_committed_at * req.body.quantity
    });
    newcartitem
        .save()
        .then(() =>
            User.findOneAndUpdate(
                { _id: curruser._id },
                { $push: { mycarts: newcartitem } }
            )
                .then(() => {
                    console.log("Cart item was pushed.");
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                })
        )
        .catch(err => {
            res.status(400).send("Bad request 2");
        });
});

router.post("/remove", async (req, res, next) => {
    let cartitemId=req.body.cartitemId;
    try{
        await mycartingeneral.findByIdAndRemove(cartitemId);
        await User.findOneAndUpdate(
            {_id:req.user._id},
            {$pull:{mycarts:{_id:cartitemId}}});
        return res.send({message:'Cart item removed successfully'});
    }
    catch(error){
        return next({
                message:
                    error.message || "Server Error",
                status: 500
            });
    }
});





// API end point to route traffic of mycarts page, split into commit and buy now
// To check authenticate function, currently disabled.
// Also after login the route takes him to the exact same page
router.get(
    "/mycarts/limit=:lvalue&offset=:ovalue&type=:type",
    (req, res) => {
        var cartsholder;
        var curruser = req.user._id;
        var typeofcart = req.params.type;
        console.log(req.originalUrl);
        if (typeofcart == "commit") {
            User.findOne({ _id: curruser, "mycarts.is_commit": true })
                .then(result => {
                    cartsholder = result.mycarts; // Array of carts of the current user
                })
                .then(() => {
                    if (cartsholder == null || cartsholder.length == 0) {
                        console.log("No carts found");
                        res.status(200).send({
                            ordersdata: "No carts found"
                        });
                    } else {
                        var startpoint = req.params.ovalue; // zero
                        var howmany = req.params.lvalue; // ten
                        console.log(
                            "carts is found and it's product marketprice: "
                        );
                        console.log(cartsholder[0].Product.marketPrice);
                        res.status(200).send({
                            cartsdata: cartsholder.splice(startpoint, howmany)
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                });
        } else {
            User.findOne({ _id: curruser, "mycarts.is_commit": false })
                .then(result => {
                    cartsholder = result.mycarts; // Array of carts of the current user
                })
                .then(async () => {
                    if (cartsholder == null || cartsholder.length == 0) {
                        console.log("No carts found");
                        res.status(200).send({
                            ordersdata: "No carts found"
                        });
                    } else {
                        var startpoint = req.params.ovalue; // zero
                        var howmany = req.params.lvalue; // ten
                        console.log(
                            "carts is found and it's product marketprice: "
                        );
                        console.log(cartsholder[0].Product.marketPrice);
                        let cupidLove=await getEstimateCupidLove(cartsholder)
                        res.status(200).send({
                            cartsdata: cartsholder.splice(startpoint, howmany)
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send("Bad request");
                });
        }
    }
);

async function getEstimateCupidLove(cart){
    let totalCupidLove=0;
    cart.forEach(async function(item){
        let saleid=cart.Sale.id;
        let sale=await SalesList.findById(saleid);
        let quantitySold=sale.quantity_sold+1;
        for(i=0;i<sale.cupidLove.length;i++){
            if(quantitySold<=sale.cupidLove[i].quantity){
                totalCupidLove+=sale.cupidLove[i].cupidLove
            }
        }
    });
    return totalCupidLove;
}


module.exports = router;
