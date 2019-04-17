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
            notification_level: { $eq: 0 },
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
            notification_level: { $eq: 1 },
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
};

start();
module.exports = agenda;
