const nodemailer = require("nodemailer");
const ejs = require("ejs");
const config = require("../config/config");
const { transationals, promotionals } = require("../templates");

//*****Allow less secure to send mails in gmail settings incase using gmail or Gsuite*****
var transporter = nodemailer.createTransport({
    host: config.MAIL.SMTP_HOST,
    port: config.MAIL.SMTP_PORT,
    secure: config.MAIL.SECURE, // true for 465, false for other ports
    auth: {
        user: config.MAIL.SMTP_USER,
        pass: config.MAIL.SMTP_PASS
    }
});

/**
 *
 * @param {Object} message
 * {to:Array/String,subject:String,body:String}
 */
const SendMail = message => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: config.MAIL.fromMail, // display from email in receipent inbox
            to: message.to, // list of receivers
            subject: message.subject, // Subject line
            html: message.body
        };

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log("Send mail err " + err);
                return reject({ success: false });
            } else {
                console.log("Mail send " + info);
                console.log(info);
                return resolve({ success: true });
            }
        });
    });
};

const EJSMapping = { ...transationals, ...promotionals };

function getEJSTemplate({ fileName }) {
    return new Promise(resolve => {
        if (!fileName) {
            throw { status: 400, message: "No file specified!" };
        }
        const content = EJSMapping[fileName];
        resolve(
            ejs.compile(content, {
                cache: true,
                filename: fileName
            })
        );
    });
}

module.exports = {
    SendMail,
    getEJSTemplate
};
