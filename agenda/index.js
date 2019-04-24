var Agenda = require("agenda");
const moment = require("moment");
//import all necessery dependencies , middlewaresscripts .
//Models
const Commits = require("../models/mycommits");
const Sales = require("../models/saleslist");
const User = require("../models/user");

//helpers
const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

const config = require("../config/config");

const agenda = new Agenda({
    db: {
        address: config.MONGO_URL
    },
    collection: "agendaJobs"
});

var start = async () => {
    await agenda._ready;

    await agenda.start();

    agenda.define("on start sale all user", (job, done) => {
        /**
         *  [PROMOTIONAL]
         * Notification level for this should be made 1 from 0
         * start time should be less and end time should be more ,
         * in that above case it comes under when its started.
         * notification_level represents how many times it sent notiifcation.
         */
        const salesQuery = {
            notification_level: 0,
            starttime: {
                $lte: moment()
                    .utcOffset(330)
                    .toDate()
            },
            endtime: {
                $gte: moment()
                    .utcOffset(330)
                    .toDate()
            }
        };

        return Sales.findOne(salesQuery)
            .exec()
            .then(salesDoc => {
                if (salesDoc) {
                    /**
                     * Use cursor to loop over all users
                     */
                    return User.find({
                        notif_subscribe: true
                    })
                        .select({ username: 1, email: 1 })
                        .cursor()
                        .on("data", async user => {
                            const ejsTemplate = await getEJSTemplate({
                                fileName: "sale_is_live.ejs"
                            });
                            const finalHTML = ejsTemplate({
                                time: moment().format("lll"),
                                username: user.name,
                                saleDetails: salesDoc //may be format properly before passing it
                            });
                            const message = {
                                to: user.email,
                                subject:
                                    "Sale is now live! check out whats there for you.",
                                body: finalHTML
                            };
                            return await SendMail(message);
                        })
                        .on("error", err => {
                            done(err);
                        })
                        .on("end", () => {
                            salesDoc.notification_level = 1;
                            salesDoc.save();
                            return true;
                        });
                } else {
                    return false;
                }
            })
            .catch(error => {
                done(error);
            });
    });
    agenda.define("before end sale all user", (job, done) => {
        /**
         *  [PROMOTIONAL]
         * Notification level for this should be made 1 from 2
         * start time should be less and end time should be more ,
         * in that above case it comes under when its about to end.
         * notification_level represents how many times it sent notiifcation.
         */
        const salesQuery = {
            notification_level: 1,
            starttime: {
                $lte: moment()
                    .utcOffset(330)
                    .toDate()
            },
            endtime: {
                $gte: moment()
                    .utcOffset(330)
                    .toDate()
            }
        };

        return Sales.findOne(salesQuery)
            .exec()
            .then(salesDoc => {
                const durationLeft = moment()
                    .utcOffset(330)
                    .diff(moment(salesDoc.end));
                if (durationLeft <= !3.1) {
                    return done({ error: "duration is" + durationLeft });
                }
                /**
                 * Use cursor to loop over all users
                 */
                return User.find({
                    notif_subscribe: true
                })
                    .select({ username: 1, email: 1 })
                    .cursor()
                    .on("data", async user => {
                        const ejsTemplate = await getEJSTemplate({
                            fileName: "sale_about_end.ejs"
                        });
                        const finalHTML = ejsTemplate({
                            time: moment().format("lll"),
                            username: user.name,
                            saleDetails: salesDoc //may be format properly before passing it
                        });
                        const message = {
                            to: user.email,
                            subject:
                                "Sale is now live! pick it before you miss.",
                            body: finalHTML
                        };
                        return await SendMail(message);
                    })
                    .on("error", err => {
                        done(err);
                    })
                    .on("end", () => {
                        salesDoc.notification_level = 2;
                        salesDoc.save();
                        return true;
                    });
            })
            .catch(error => {
                done(error);
            });
    });

    agenda.define("pay_full_sellBuffer_end", (job, done) => {
        /**
         * This should be invoked to ask committers to pay the full amount now.
         * and only be invoked when buffer time started and not yet ended.
         */
        Commits.find({
            is_active: true,
            notification_level: 1,
            "sale.endtime": {
                $lte: moment()
                    .utcOffset(330)
                    .toDate()
            }
        })
            .cursor()
            .on("data", async commitDoc => {
                const bufferTriggerable =
                    moment()
                        .utcOffset(330)
                        .diff(
                            moment(commitDoc.sale.endtime)
                                .utcOffset(330)
                                .add(commitDoc.sale.sale_buffer_time, "h"),
                            "h"
                        ) < 3.1;
                if (bufferTriggerable) {
                    return done();
                }
                //send mail here

                const ejsTemplate = await getEJSTemplate({
                    fileName: "pay_full_sellBuffer_end.ejs"
                });
                const finalHTML = ejsTemplate({
                    time: moment().format("lll"),
                    commitDetails: commitDoc //may be format properly before passing it
                });
                const message = {
                    to: commitDoc.User.email,
                    subject:
                        "[REMINDER] Sale has ended! pay the rest amount before it goes.",
                    body: finalHTML
                };
                await SendMail(message);
                commitDoc.notification_level = 2;
                commitDoc.save();
                return true;
            })
            .on("error", error => {
                done(error);
            })
            .on("end", () => {
                return done();
            });
    });

    agenda.define("pay_full_sellBuffer_start", (job, done) => {
        /**
         * This should be invoked to ask committers to pay the full amount now.
         * and only be invoked when buffer time started and not yet ended.
         */
        Commits.find({
            is_active: true,
            notification_level: 0,
            "sale.endtime": {
                $lte: moment()
                    .utcOffset(330)
                    .toDate()
            }
        })
            .cursor()
            .on("data", async commitDoc => {
                const bufferTimeExpired =
                    moment().utcOffset(330) <
                    moment(commitDoc.sale.endtime)
                        .utcOffset(330)
                        .add(commitDoc.sale.sale_buffer_time, "h");
                if (bufferTimeExpired) {
                    return done();
                }
                //send mail here

                const ejsTemplate = await getEJSTemplate({
                    fileName: "pay_full_sellBuffer_start.ejs"
                });
                const finalHTML = ejsTemplate({
                    time: moment().format("lll"),
                    commitDetails: commitDoc //may be format properly before passing it
                });
                const message = {
                    to: commitDoc.User.email,
                    subject:
                        "Sale has ended! pay the rest amount before it goes.",
                    body: finalHTML
                };
                await SendMail(message);
                commitDoc.notification_level = 1;
                commitDoc.save();
                return true;
            })
            .on("error", error => {
                done(error);
            })
            .on("end", () => {
                return done();
            });
    });
    await agenda.schedule("in 20 seconds", "on start sale all user");
    await agenda.schedule("in 20 seconds", "before end sale all user");
    await agenda.schedule("in 20 seconds", "pay_full_sellBuffer_end");
    await agenda.schedule("in 20 seconds", "pay_full_sellBuffer_start");
};

start();
module.exports = agenda;
