var http = require("http");
const request=require('request');


async function sendOTP(phone){

// var options = {
//   "method": "POST",
//   "hostname": "control.msg91.com",
//   "port": null,
//   "path": "/api/sendotp.php?authkey=271701A7FBbvWdD52e5cad80c2&message=Your%20verification%20code%20is%20%23%23OTP%23%23&sender=Cupido&mobile="+phone,
//   "headers": {}
// };

// var req = http.request(options, function (res) {
//   var chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     var body = Buffer.concat(chunks);
//     console.log(body.toString());
//     return body.toString;
//   });
// });

// req.end();

request.post(
        'https://control.msg91.com/api/sendotp.php?authkey=271701A7FBbvWdD52e5cad80c2&message=Your%20verification%20code%20is%20%23%23OTP%23%23&sender=Cupido&mobile='+phone,
        { json: true},
        async function (error, response, body) {
            if(!error){
              console.log(body);
              return body;
            }
            else{
              return error;
            }
        });

}

module.exports={sendOTP};