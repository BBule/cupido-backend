const express = require("express");
const router = express.Router();
const lodash = require("lodash");
var jwt = require("jsonwebtoken");
const csv = require("csvtojson");
const moment = require("moment");
// Models
const config = require("../../config/config");
const Saleslist = require("../../models/saleslist");
const EmailToken = require("../../models/emailtoken");
const User = require("../../models/user.js");
const commitCont = require("../../controller/commits.cont");
// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// router.get("/convert", (req, res, next) => {
//     const csvFilePath = "/home/yash/git/cupido-backend/routes/file1.csv";
//     csv()
//         .fromFile(csvFilePath)
//         .then(jsonObj => {
//             res.send(jsonObj);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

// router.get("/agenda", (req, res, next) => {
//     console.log("hello2");
//     var currDay = moment().toDate();
//     var lastDay = moment().add(-24, "h").toDate();
//     Saleslist.find({
//         $or: [
//             {
//                 $and: [
//                     { $expr: { $gte: ["$endtime", lastDay] } },
//                     { $expr: { $lte: ["$endtime", currDay] } }
//                 ]
//             },
//             {
//                 $expr: {
//                     $gte: [
//                         "$quantity_sold",
//                         "$cupidLove.quantity"
//                     ]
//                 }
//             }
//         ]
//     })
//         .then(async sales => {
//             return res.send(sales);
//             // asyncForEach(sales, async sale => {
//             //     var randomNumbers = Math.floor(Math.random() * (11 - 5)) + 5;
//             //     const newDay = moment()
//             //         .add(randomNumbers, "d")
//             //         .toDate();
//             //     Sales.findOneAndUpdate(
//             //         { _id: sale._id },
//             //         {
//             //             endtime: newDay,
//             //             quantity_sold: 0,
//             //             quantity_committed: 0
//             //         },
//             //         {
//             //             useFindAndModify: false
//             //         }
//             //     )
//             //         .then(sale => {
//             //             console.log("sale", sale._id);
//             //             console.log("Sale Updated");
//             //         })
//             //         .catch(err => {
//             //             console.log("Scheduler Error sale update");
//             //         });
//             // });
//             // done();
//         })
//         .catch(err => {
//             console.log("Error! No Sale Found");
//             done();
//         });
// });

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

router.get("/sales/Price-Low-to-High", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    query1 = req.query;
    delete query1.limit;
    delete query1.skip;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats,
            copy: { $ne: true }
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            copy: { $ne: true }
        };
    }
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .sort({ salePrice: 1 })
        .populate("product.id")
        .lean()
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

router.get("/bestSellers", (req, res, next) => {
    var currdate = newIndDate();
    let query = {
        endtime: { $gte: currdate },
        starttime: { $lte: currdate },
        copy: { $ne: true },
        "product.category": {
            $not: { $in: ["mensclothing", "womensclothing"] }
        }
    };
    // console.log(query)
    Saleslist.find(query)
        .populate("product.id")
        .sort({ timecreated: -1 })
        .lean()
        .exec()
        .limit(16)
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

router.get("/sales/Price-High-to-Low", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    query1 = req.query;
    delete query1.limit;
    delete query1.skip;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats,
            copy: { $ne: true }
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            copy: { $ne: true }
        };
    }
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .sort({ salePrice: -1 })
        .populate("product.id")
        .lean()
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

router.get("/sales/endingSoon", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    query1 = req.query;
    delete query1.limit;
    delete query1.skip;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats,
            copy: { $ne: true }
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            copy: { $ne: true }
        };
    }
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .sort({ endtime: 1 })
        .populate("product.id")
        .lean()
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

router.get("/sales/recentlyLaunched", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    query1 = req.query;
    delete query1.limit;
    delete query1.skip;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats,
            copy: { $ne: true }
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            copy: { $ne: true }
        };
    }
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .sort({ timecreated: -1 })
        .populate("product.id")
        .lean()
        .then(sales => {
            return res.send(sales);
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

// API end point to route traffic of current sales
router.get("/presentsales", (req, res, next) => {
    const { limit = 20, skip = 0, cats } = req.query;
    query1 = req.query;
    delete query1.limit;
    delete query1.skip;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats,
            copy: { $ne: true }
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            copy: { $ne: true }
        };
    }
    // let category=(req.query.category?req.query.category:null);
    // delete query1.category;
    // if(category){
    //     query=`{"product.Category":"${category}"`;
    //     Object.keys(query1).forEach(function(key){
    //         query+=`,"product.filters.${key}":"${req.query[key]}"`;
    //     });
    //     query=JSON.parse(query+`}`);
    //     query.endtime={ $gte: currdate };
    //     query.starttime={ $lte: currdate };
    // }else{
    //     query={};
    //     query.endtime={ $gte: currdate };
    //     query.starttime={ $lte: currdate };
    // }
    // console.log(query);
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .populate("product.id")
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ timecreated: -1 })
        .lean()
        .exec()
        .then(result => {
            return res.send(result);
            // if (result && result.length) {
            //     const a = result.map(async i => {
            //         i.total_commit =
            //             ((await commitCont.getCommitCountBySale(i._id)) || 0) +
            //             (i.counter_flag_temp || 5);

            //         const b = lodash.sortBy(i.cupidLove, "quantity");
            //         const c = b.map(element => {
            //             return {
            //                 key: " > " + element.quantity,
            //                 price:
            //                     (i.product.id.marketPrice || 0) -
            //                     element.cupidLove
            //             };
            //         });
            //         i.cupid_summery = c;
            //         return i;
            //     });
            //     return Promise.all(a);
            // } else {
            //     return res.json([]);
            // }
        })
        .catch(err => {
            console.log(err);
            return next({ status: 400, message: "unknown error occured" });
        });
});

// API end point to route traffic of current sales for mobile app with no copy filter
router.get("/presentsalescopy", (req, res, next) => {
    const { cats } = req.query;
    query1 = req.query;
    var currdate = newIndDate();
    let query;
    if (cats) {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate },
            "product.category": cats
        };
    } else {
        query = {
            endtime: { $gte: currdate },
            starttime: { $lte: currdate }
        };
    }
    Saleslist.find(query, {
        "product.category": 0,
        "product.filters": 0,
        "product.subCategory": 0
    })
        .populate("product.id")
        .sort({ timecreated: -1 })
        .lean()
        .exec()
        .then(result => {
            return res.send(result);
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
    Saleslist.find({ starttime: { $gte: currdate }, copy: false })
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

router.get("/verifyemail/:token", async function(req, res, next) {
    console.log(req.params.token);
    var token = req.params.token;
    try {
        var emailtoken = await EmailToken.findOne({ token: token });
        if (emailtoken.used) {
        } else {
            var decoded;

            try {
                decoded = await jwt.verify(token, config.JWT_SECRET);
                console.log(decoded);
                var user = await User.findOne({
                    _id: decoded._id,
                    "email.email": decoded.email
                });
                console.log(user);
                user.email.verified = true;
                await user.save();
                res.send({
                    type: "auth",
                    message: "Email verified successfully"
                });
            } catch (ex) {
                console.log(ex);
                return next({
                    stack: ex,
                    status: 400,
                    message: "Invalid Link"
                });
            }
        }
    } catch (e) {
        return next({
            stack: e,
            status: 500,
            message: "bad request!"
        });
    }
});

module.exports = router;
