var Agenda = require("agenda");
const moment = require("moment");
//import all necessery dependencies , middlewaresscripts .
//Models
const Commits = require("../models/mycommits");
const Orders = require("../models/myorders");
const Sales = require("../models/saleslist");
const User = require("../models/user");

//helpers
// const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

const config = require("../config/config");

const agenda = new Agenda({
    db: {
        address: config.MONGO_URL
    },
    collection: "agendaJobs"
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

agenda.define("Converting commits to orders v3.0", function(job, done) {
    console.log("hello1");
    Sales.find({
        $expr: { $gte: ["$quantity_committed", "$cupidLove.quantity"] }
    })
        .then(async sales => {
            if (sales.length == 0) {
                console.log("No Sale Found!");
                done();
            } else {
                asyncForEach(sales, async sale => {
                    console.log("sales Id", sale._id);
                    await Commits.find({ "sale.id": sale._id })
                        .then(commits => {
                            console.log("commits length", commits.length);
                            if (commits.length != 0) {
                                //console.log("Entered into if block");
                                asyncForEach(commits, async commit => {
                                    //console.log(commit);
                                    order1 = new Orders({
                                        "Product.id": commit.Product.id,
                                        "sale.id": commit.sale.id,
                                        "User.id": commit.User.id,
                                        shipping_address:
                                            commit.shipping_address,
                                        payment_details: commit.payment_details,
                                        order_amount: commit.commit_amount,
                                        order_status: "Processed",
                                        referralAmount: commit.referralAmount,
                                        size: commit.size,
                                        quantity: commit.quantity
                                    });
                                    //console.log(order1);
                                    await order1
                                        .save()
                                        .then(async order => {
                                            console.log("order saved");
                                            Commits.deleteMany({
                                                _id: commit._id
                                            })
                                                .then(async () => {
                                                    Sales.findOneAndUpdate(
                                                        {
                                                            _id: sale.id
                                                        },
                                                        {
                                                            $inc: {
                                                                quantity_sold:
                                                                    commit.quantity
                                                            },
                                                            quantity_committed: 0
                                                        },
                                                        {
                                                            useFindAndModify: false
                                                        }
                                                    )
                                                        .then(sale => {
                                                            console.log(
                                                                "Sale Updated"
                                                            );
                                                            //done();
                                                        })
                                                        .catch(err => {
                                                            console.log(
                                                                "Scheduler Error sale update"
                                                            );
                                                            // done(err);
                                                        });
                                                    console.log(
                                                        "Commit Deleted"
                                                    );
                                                })
                                                .catch(err => {
                                                    console.log(
                                                        "Scheduler Error Commit Deletion"
                                                    );
                                                    // done(err);
                                                });
                                        })
                                        .catch(err => {
                                            console.log(
                                                "Scheduler Error Order"
                                            );
                                            // done(err);
                                        });
                                });
                            }
                        })
                        .catch(err => {
                            console.log("Scheduler Error Commit");
                            // done(err);
                        });
                });
                done();
            }
        })
        .catch(err => {
            console.log("Scheduler Error Sale");
            done();
        });
    //done();
});

agenda.define("Refreshing Sales last 24h", function(job, done) {
    const lastDay = moment()
        .add(-24, "h")
        .toDate();
    console.log("hello2");
    Sales.find({
        $or: [
            { $expr: { $lte: ["$endtime", lastDay] } },
            {
                $expr: {
                    $lte: [
                        "$cupidLove.quantity",
                        "$quantity_committed" + "$quantity_sold"
                    ]
                }
            }
        ]
    })
        .then(sales => {
            asyncForEach(sales, async sale => {
                var randomNumbers = Math.floor(Math.random() * (11 - 5)) + 5;
                const newDay = moment()
                    .add(randomNumbers, "d")
                    .toDate();
                Sales.findOneAndUpdate(
                    { _id: sale._id },
                    {
                        endtime: newDay,
                        quantity_sold: 0,
                        quantity_committed: 0
                    },
                    {
                        useFindAndModify: false
                    }
                )
                    .then(sale => {
                        console.log("sale", sale._id);
                        console.log("Sale Updated");
                    })
                    .catch(err => {
                        console.log("Scheduler Error sale update");
                    });
            });
            done();
        })
        .catch(err => {
            console.log("Error! No Sale Found");
            done();
        });
});
// agenda.define("XYZ", (job, done) => {
//     console.log("Hello with schedule");
//     done();
// });

agenda.on("ready", function() {
    console.log("Agenda Started");
    agenda.schedule(
        "2 seconds",
        agenda.every("30 minutes", "Converting commits to orders v3.0")
    );
    agenda.schedule(
        "2 seconds",
        agenda.every("24 hours", "Refreshing Sales last 24h")
    );
    agenda.start();
});

// var start = async () => {
//     await agenda._ready;

//     await agenda.start();

// agenda.define("on start sale all user", (job, done) => {
//     /**
//      *  [PROMOTIONAL]
//      * Notification level for this should be made 1 from 0
//      * start time should be less and end time should be more ,
//      * in that above case it comes under when its started.
//      * notification_level represents how many times it sent notiifcation.
//      */
// const salesQuery = {
//     notification_level: 0,
//     starttime: {
//         $lte: moment()
//             .utcOffset(330)
//             .toDate()
//     },
//     endtime: {
//         $gte: moment()
//             .utcOffset(330)
//             .toDate()
//     }
// };

//     return Sales.findOne(salesQuery)
//         .exec()
//         .then(salesDoc => {
//             if (salesDoc) {
//                 /**
//                  * Use cursor to loop over all users
//                  */
//                 return User.find({
//                     notif_subscribe: true
//                 })
//                     .select({ username: 1, email: 1 })
//                     .cursor()
//                     .on("data", async user => {
//                         const ejsTemplate = await getEJSTemplate({
//                             fileName: "sale_is_live.ejs"
//                         });
//                         const finalHTML = ejsTemplate({
//                             time: moment().format("lll"),
//                             username: user.name,
//                             saleDetails: salesDoc //may be format properly before passing it
//                         });
//                         const message = {
//                             to: user.email,
//                             subject:
//                                 "Sale is now live! check out whats there for you.",
//                             body: finalHTML
//                         };
//                         return await SendMail(message);
//                     })
//                     .on("error", err => {
//                         done(err);
//                     })
//                     .on("end", () => {
//                         salesDoc.notification_level = 1;
//                         salesDoc.save();
//                         return true;
//                     });
//             } else {
//                 return false;
//             }
//         })
//         .catch(error => {
//             done(error);
//         });
// });
// agenda.define("before end sale all user", (job, done) => {
//     /**
//      *  [PROMOTIONAL]
//      * Notification level for this should be made 1 from 2
//      * start time should be less and end time should be more ,
//      * in that above case it comes under when its about to end.
//      * notification_level represents how many times it sent notiifcation.
//      */
//     const salesQuery = {
//         notification_level: 1,
//         starttime: {
//             $lte: moment()
//                 .utcOffset(330)
//                 .toDate()
//         },
//         endtime: {
//             $gte: moment()
//                 .utcOffset(330)
//                 .toDate()
//         }
//     };

//     return Sales.findOne(salesQuery)
//         .exec()
//         .then(salesDoc => {
//             const durationLeft = moment()
//                 .utcOffset(330)
//                 .diff(moment(salesDoc.end));
//             if (durationLeft <= !3.1) {
//                 return done({ error: "duration is" + durationLeft });
//             }
//             /**
//              * Use cursor to loop over all users
//              */
//             return User.find({
//                 notif_subscribe: true
//             })
//                 .select({ username: 1, email: 1 })
//                 .cursor()
//                 .on("data", async user => {
//                     const ejsTemplate = await getEJSTemplate({
//                         fileName: "sale_about_end.ejs"
//                     });
//                     const finalHTML = ejsTemplate({
//                         time: moment().format("lll"),
//                         username: user.name,
//                         saleDetails: salesDoc //may be format properly before passing it
//                     });
//                     const message = {
//                         to: user.email,
//                         subject:
//                             "Sale is now live! pick it before you miss.",
//                         body: finalHTML
//                     };
//                     return await SendMail(message);
//                 })
//                 .on("error", err => {
//                     done(err);
//                 })
//                 .on("end", () => {
//                     salesDoc.notification_level = 2;
//                     salesDoc.save();
//                     return true;
//                 });
//         })
//         .catch(error => {
//             done(error);
//         });
// });

// agenda.define("pay_full_sellBuffer_end", (job, done) => {
//     /**
//      * This should be invoked to ask committers to pay the full amount now.
//      * and only be invoked when buffer time started and not yet ended.
//      */
//     Commits.find({
//         is_active: true,
//         notification_level: 1,
//         "sale.endtime": {
//             $lte: moment()
//                 .utcOffset(330)
//                 .toDate()
//         }
//     })
//         .cursor()
//         .on("data", async commitDoc => {
//             const bufferTriggerable =
//                 moment()
//                     .utcOffset(330)
//                     .diff(
//                         moment(commitDoc.sale.endtime)
//                             .utcOffset(330)
//                             .add(commitDoc.sale.sale_buffer_time, "h"),
//                         "h"
//                     ) < 3.1;
//             if (bufferTriggerable) {
//                 return done();
//             }
//             //send mail here

//             const ejsTemplate = await getEJSTemplate({
//                 fileName: "pay_full_sellBuffer_end.ejs"
//             });
//             const finalHTML = ejsTemplate({
//                 time: moment().format("lll"),
//                 commitDetails: commitDoc //may be format properly before passing it
//             });
//             const message = {
//                 to: commitDoc.User.email,
//                 subject:
//                     "[REMINDER] Sale has ended! pay the rest amount before it goes.",
//                 body: finalHTML
//             };
//             await SendMail(message);
//             commitDoc.notification_level = 2;
//             commitDoc.save();
//             return true;
//         })
//         .on("error", error => {
//             done(error);
//         })
//         .on("end", () => {
//             return done();
//         });
// });

// agenda.define("pay_full_sellBuffer_start", (job, done) => {
//     /**
//      * This should be invoked to ask committers to pay the full amount now.
//      * and only be invoked when buffer time started and not yet ended.
//      */
//     Commits.find({
//         is_active: true,
//         notification_level: 0,
//         "sale.endtime": {
//             $lte: moment()
//                 .utcOffset(330)
//                 .toDate()
//         }
//     })
//         .cursor()
//         .on("data", async commitDoc => {
//             const bufferTimeExpired =
//                 moment().utcOffset(330) <
//                 moment(commitDoc.sale.endtime)
//                     .utcOffset(330)
//                     .add(commitDoc.sale.sale_buffer_time, "h");
//             if (bufferTimeExpired) {
//                 return done();
//             }
//             //send mail here

//             const ejsTemplate = await getEJSTemplate({
//                 fileName: "pay_full_sellBuffer_start.ejs"
//             });
//             const finalHTML = ejsTemplate({
//                 time: moment().format("lll"),
//                 commitDetails: commitDoc //may be format properly before passing it
//             });
//             const message = {
//                 to: commitDoc.User.email,
//                 subject:
//                     "Sale has ended! pay the rest amount before it goes.",
//                 body: finalHTML
//             };
//             await SendMail(message);
//             commitDoc.notification_level = 1;
//             commitDoc.save();
//             return true;
//         })
//         .on("error", error => {
//             done(error);
//         })
//         .on("end", () => {
//             return done();
//         });
// });
// await agenda.every("in 3 minutes", "Converting commits to orders");
// await agenda.schedule("in 20 seconds", "on start sale all user");
// await agenda.schedule("in 20 seconds", "before end sale all user");
// await agenda.schedule("in 20 seconds", "pay_full_sellBuffer_end");
// await agenda.schedule("in 20 seconds", "pay_full_sellBuffer_start");
// };

// start();
module.exports = agenda;
