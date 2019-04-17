var Agenda = require("agenda");
//import all necessery dependencies , middlewaresscripts .
const config = require("../config/config");
const agenda = new Agenda({
    db: {
        address: config.MONGO_URL
    },
    collection: "agendaJobs"
});

var start = async function() {
    await agenda._ready;

    await agenda.start();

    agenda.define("CheckForTxn and Send", (job, done) => {
        // console.log(job.data);
        const jobData = job.attrs.data;
        const failCount = job.attrs.failCount || 0;
    });
};

start();
module.exports = agenda;
