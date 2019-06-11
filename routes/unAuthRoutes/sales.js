const express = require("express");
const router = express.Router();
const lodash = require("lodash");
// Models

const Saleslist = require("../../models/saleslist");
const commitCont = require("../../controller/commits.cont");
// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

router.get("/getDetails", (req, res, next) => {
    if (!req.query.id) {
        return next({
            status: 400,
            message: "No sale found"
        });
    }
    return Saleslist.find({
        _id: { $in: req.query.id ? req.query.id.split(",") : [] }
    })
        .populate("product.id")
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            console.log(err);
            return next({
                status: 400,
                message: "No sale found",
                stack: err
            });
        });
});

router.get("/getSalesById", (req, res, next) => {});

// API end point to route traffic of current sales
router.get("/presentsales", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    var currdate = newIndDate();
    let query = {
        endtime: { $gte: currdate },
        starttime: { $lte: currdate }
    };
    if (cats && cats.length) {
        query["product.category"] = { $in: cats.split(",") };
    }
    return Saleslist.find(query)
        .populate("product.id")
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ endtime: 1 })
        .lean()
        .exec()
        .then(result => {
            if (result && result.length) {
                const a = result.map(async i => {
                    i.total_commit =
                        ((await commitCont.getCommitCountBySale(i._id)) || 0) +
                        (i.counter_flag_temp || 5);

                    const b = lodash.sortBy(i.cupidLove, "quantity");
                    const c = b.map(element => {
                        return {
                            key: " > " + element.quantity,
                            price:
                                (i.product.id.marketPrice || 0) -
                                element.cupidLove
                        };
                    }); 
                    i.cupid_summery = c;
                    return i;
                });
                return Promise.all(a);
            } else {
                return res.json([]);
            }
        })
        .then(data => {
            return res.json(data);
        })

        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

// API end point to route traffic of future sales
router.get("/futuresales", (req, res, next) => {
    var currdate = newIndDate();
    var salesholder;
    Saleslist.find({ starttime: { $gte: currdate } })
        .populate("product.id")
        .sort({ startpoint: 1 })
        .then(result => {
            salesholder = result;
            console.log(
                "Total futuresales found : " + result.length.toString()
            );
        })
        .then(() => {
            var queryParams = salesholder;
            var startpoint = req.query.offset; // zero
            var howmany = req.query.limit; // ten
            return res.send(queryParams.splice(startpoint, howmany));
            // return app.render(req, res,"/timesales", queryParams);
        })
        .catch(err => {
            return next({
                stack: err,
                status: 400,
                message: "bad request!"
            });
        });
});

module.exports = router;
