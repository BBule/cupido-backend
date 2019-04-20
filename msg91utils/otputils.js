const request = require("request");
const config = require("../config/config");

async function sendSMS(
    phone,
    message = "Your%20verification%20code%20is%20%23%23OTP%23%23"
) {
    request.post(
        `https://control.msg91.com/api/sendotp.php?authkey=${
            config.SMS.AUTH_KEY
        }&message=${message}&sender=${config.SMS.SENDER_ID}&mobile=` + phone,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                console.log(body);
                return body;
            } else {
                return Promise.reject(error);
            }
        }
    );
}

async function verifyOTP(
    phone,
    otp
) {
    request.post(
        `https://control.msg91.com/api/verifyRequestOTP.php?authkey=${
            config.SMS.AUTH_KEY
        }&mobile=${phone}&otp=${otp}`,
        { json: true },
        async function(error, response, body) {
            if (!error) {
                console.log(body);
                return body;
            } else {
                return Promise.reject(error);
            }
        }
    );
}

module.exports = { sendSMS };
