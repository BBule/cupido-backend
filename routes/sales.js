const express = require("express");
const router = express.Router();

// Models

const Saleslist = require("../models/saleslist");

// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// API end point to route the category page
// /api/sales/category=watches&gender=m&status=live&limit=10&offset=15
// if category is valid, then check for gender, then check for status then query db for limits and offset
// Currently the sales are sorted on the basis of values of page hits and time left.
// Formula: 0.33*page_hits/max(time_left in seconds,1000)
// Applied check when data is present
//Displays the live sales of a particular category taking input of lvalue and offset.
router.get(
    "/category=:categoryname&gender=:gender&status=:status&limit=:lvalue&offset=:ovalue",
    (req, res) => {
        console.log("Requesting saleslist page");
        const categoryname = req.params.categoryname;
        const gender = req.params.gender;
        const status = req.params.status;
        const lvalue = req.params.lvalue;
        const offset = req.params.ovalue;

        console.log(categoryname);
        // categorylist.findOne({category_name:categoryname},function(err,onecategory){
        //   if(err){
        //     console.log("Error");
        //     console.log(err);
        //     res.status(200).send({
        //       error_value :  "error"
        //     });
        //   }
        //   else if(!onecategory){ // intended category is not found
        //     console.log("Not a category");
        //     res.status(200).send({
        //     warning : "doc category not found"
        //   });
        //   }
        /*else*/ if (
            /*onecategory&&*/ (gender == "M" || gender == "F") &&
            status == "live"
        ) {
            var currdate = newIndDate();
            var genderofsale = gender == "M" ? false : true;
            console.log(genderofsale);
            Saleslist.find({
                "product.category": categoryname /*gender:genderofsale,*/,
                endtime: { $gte: currdate },
                starttime: { $lte: currdate }
            })
                .then(listofsales => {
                    console.log("Category found : ");
                    console.log(listofsales);
                    console.log(gender == "M" ? false : true);
                    salesholder = listofsales;
                    salesholder.sort(function(a, b) {
                        const ttl1 = a.endtime - currdate;
                        const ttl2 = b.endtime - currdate;
                        a.macho_factor =
                            (0.33 * a.sale_visits) / Math.max(ttl1, 1000);
                        b.macho_factor =
                            (0.33 * b.sale_visits) / Math.max(ttl2, 1000);
                        return b.macho_factor - a.macho_factor;
                    });
                })
                .then(() => {
                    var queryParams = salesholder;
                    var startpoint = req.params.ovalue; // zero
                    var howmany = req.params.lvalue; // ten
                    res.status(200).send({
                        listofsales: queryParams.splice(startpoint, howmany)
                    });
                });
        } else {
            res.status(200).send({
                error: "Some other error"
            });
        }
    }
);

// API end point to route traffic of current sales
router.get("/presentsales/limit=:lvalue&offset=:ovalue", (req, res) => {
    var currdate = newIndDate();
    var salesholder;
    Saleslist.find({
        endtime: { $gte: currdate },
        starttime: { $lte: currdate }
    })
        .sort({ endtime: 1 })
        .then(result => {
            salesholder = result;
            console.log(
                "Total presentsales found : " + result.length.toString()
            );
        })
        .then(() => {
            var queryParams = salesholder;
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            res.status(200).send({
                listofpresentsales: queryParams.splice(startpoint, howmany)
            });
            // return app.render(req, res,"/timesales", queryParams);
        })
        .catch(err => {
            res.status(400).send("Bad request");
        });
});

// API end point to route traffic of future sales
router.get("/futuresales/limit=:lvalue&offset=:ovalue", (req, res) => {
    var currdate = newIndDate();
    var salesholder;
    Saleslist.find({ starttime: { $gte: currdate } })
        .sort({ startpoint: 1 })
        .then(result => {
            salesholder = result;
            console.log(
                "Total futuresales found : " + result.length.toString()
            );
        })
        .then(() => {
            var queryParams = salesholder;
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            res.status(200).send({
                listoffuturesales: queryParams.splice(startpoint, howmany)
            });
            // return app.render(req, res,"/timesales", queryParams);
        })
        .catch(err => {
            res.status(400).send("Bad request");
        });
});

module.exports = router;