const express = require("express");
const router = express.Router();
// const cron = require("node-cron");

app = express();

// // Helper Functions
// function newIndDate(){
//   var nDate = new Date().toLocaleString('en-US', {
//       timeZone: 'Asia/Calcutta'
//   });

//   var currentTime = new Date();

// // var currentOffset = currentTime.getTimezoneOffset();

// var ISTOffset = 330;   // IST offset UTC +5:30

// var ISTTime = new Date(currentTime.getTime() + (ISTOffset)*60000);
//   return ISTTime;
// }

// // Models
// const User=require("../models/user");
// const Products = require("../models/Products");
// const Saleslist = require("../models/saleslist");
// const mycartingeneral = require("../models/mycartingeneral");
// const mygifts = require('../models/mygifts');
// const mycomments = require('../models/mycomments');
// const mycommits = require('../models/mycommits');
// const myaddresses = require('../models/myaddresses');
// // const allinventory = require('../models/allinventory');
// const myorders = require('../models/myorders');
// const categorylist = require('../models/categorylist');

// // Sendnotifs function
// function sendnotifs(firstvalue,typeofnotif){

// }

// function sendmarketingnotifs(listofsaleids){

// }

// function sendcommitnotif(listofuserids,saleid,type){

// }

// // Cron Job for generating notifs for shopcart abandoners
// // At the end of each minute check whether some sale has hit the time markers, if yes
// // generate notifications
// cron.schedule("* * * * *", ()=> {
//   console.log("Checking the shopcart abandoners every minute, current time is : "+newIndDate().toString());
//   const currdate = newIndDate();
//   Saleslist.find({endtime : { $gte : currdate} ,starttime : { $lte : currdate}}).then(
//     listsale => {
//       // For each sale if the time diff is 2/3 of total time, or the sale is 1hr away.
//       console.log("Total current sales found : " + listsale.length.toString());
//       for(var i=0;i<listsale.length;i++){
//         const ttimerun = listsale[i].endtime - listsale[i].starttime;
//         const timepassed = currdate - listsale[i].starttime;
//         // console.log("TTIMERUN, TTIMEPASSED,CURRDATE,newdate");
//         // console.log(ttimerun/(1000*60*60*24),timepassed/(1000*60*60*24),currdate,new Date());
//         if(timepassed>(0.67)*ttimerun && listsale[i].notif2over3==false){
//           // Data to be sent, saleid, type of notif
//           console.log("Sending notifs for 2/3 time, the sale id is "+listsale[i]._id.toString());
//           sendnotifs(listsale[i]._id,"shopcart2/3");
//           listsale[i].notif2over3 = true;
//         }
//         else if(listsale[i].notif2over3==true){
//           console.log("2/3 notifs already sent");
//         }
//         else if(timepassed<=(0.67)*ttimerun){
//           console.log("No proper time to send 2/3 notifs");
//         }
//         if(ttimerun-timepassed<60*60*1000 && listsale[i].notifcartlasthour==false){
//           // Data to be sent, saleid, type of notif
//           console.log("Sending notifs for last heure time, the sale id is "+listsale[i]._id.toString());
//           console.log("Sending notifs for last heure time");
//           sendnotifs(listsale[i]._id,"shopcartlasthour");
//           listsale[i].notifcartlasthour = true;
//         }
//         else if(listsale[i].notifcartlasthour==true){
//           console.log("last hour notifs already sent");
//         }
//         else if(ttimerun-timepassed>=60*60*1000){
//           console.log("No proper time to send last hour notifs");
//         }
//         console.log("Saving the list for any possible changes");
//         Saleslist.findOneAndUpdate({_id:listsale[i]},{
//           $set : {
//             notif2over3 : listsale[i].notif2over3,
//             notifcartlasthour : listsale[i].notifcartlasthour
//           }
//         },{new:true}, function(err,docsale){
//           if(err) console.log(err);
//           else console.log("Sales was updated");
//         });
//       }
//     }
//   ).catch(
//     (err) => {
//       console.log(err);
//     }
//   )
// });

// // Cron Job for generating notifs for marketing to all users
// // At 7 pm everyday send notifs to all the users of the trending top 5 sales on the DB
// cron.schedule("5 19 * * *", ()=> {
//   console.log("Running cron job trending 5 sales marketing, remember its 7:05pm");
//   const currdate = newIndDate();
//   // First update macho-factor of all sales
//   Saleslist.find({endtime : { $gte : currdate} ,starttime : { $lte : currdate}})
//   .then(
//     (docsales) => {
//       console.log("Total sales are " +docsales.length.toString());
//       for(var i=0;i<docsales.length;i++){
//         Saleslist.update({_id:docsales[i]._id},{
//           $set : {
//             macho_factor : 0.33*docsales[i].sale_visits/Math.max(docsales[i].endtime-newIndDate(),1000)
//           }
//         },{new:true},(updatedsale)=>{
//           console.log("Sale was updated");
//           console.log(updatedsale); // Why is it given null, though works just fine
//         })
//       }
//     }
//   ).then(
//     // After updating send notifs
//   Saleslist.find({endtime : { $gte : currdate} ,starttime : { $lte : currdate}}).sort({machofactor:-1}).then(
//     listofsales => {
//       // Have to send all of them together, if not 5 different mails need to be generated.
//       var idlist = [];
//       const len = listofsales.length;
//       for(var i=0;i<len&&i<5;i++){
//         idlist.push(listofsales[i]._id);
//       }
//       sendmarketingnotifs(idlist);
//     }
//   )
//   ).catch(
//     (err) => {
//       console.log("errorin updating macho factor")
//       console.log(err);
//     }
//   );

// });

// // Cron Job for generating notifs for people who have commited and not paid fully
// // At the end of each minute check whether some sale has hit the time markers, if yes
// // generate notifications for those commiters
// cron.schedule("* * * * *", ()=> {
//   console.log("Checking the non paid full customers every minute, current time is : "+newIndDate().toString());
//   console.log("First checking current sales only");
//   const currdate = newIndDate();
//   Saleslist.find({endtime : { $gte : currdate} ,starttime : { $lte : currdate}}).then(
//     listofsales => {
//       console.log("Total current sales"+listofsales.length.toString());
//       for(var i=0;i<listofsales.length;i++){
//         const ttimerun = listofsales[i].endtime - listofsales[i].starttime;
//         const timepassed = currdate - listofsales[i].starttime;
//         if(timepassed>.25*ttimerun&&listofsales[i].notif_buy_tover4==false){
//           console.log("Found a sale for buy_t/4 notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"t/4");
//         console.log("Sending t/4 notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_tover4 : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_tover4.toString());
//           });
//         }
//         if(timepassed>.50*ttimerun&&listofsales[i].notif_buy_2tover4==false){
//           console.log("Found a sale for buy_2t/4 notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"2t/4");
//         console.log("Sending 2t/4 notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_2tover4 : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_2tover4.toString());
//           });
//         }
//         if(timepassed>.75*ttimerun&&listofsales[i].notif_buy_3tover4==false){
//           console.log("Found a sale for buy_3t/4 notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"3t/4");
//         console.log("Sending 3t/4 notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_3tover4 : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_3tover4.toString());
//           });
//         }
//         if((ttimerun-timepassed)<60*60*1000&&listofsales[i].notif_buy_lasthour==false){
//           console.log("Found a sale for buy_last_hour notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"lasthour");
//         console.log("Sending lasthour notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_lasthour : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_lasthour.toString());
//           });
//         }

//       }
//     }
//   ).catch(
//     (err) => {
//       console.log("error occured in findinf current sale")
//       console.log(err);
//     }
//   );

// });

// // Cron Job for generating notifs for people who have commited and
// // not paid fully in the sale_buffer_time
// // At the end of each minute check whether some sale has hit the time markers, if yes
// // generate notifications for those commiters
// cron.schedule("* * * * *", ()=> {
//   console.log("Checking the non paid full customers every minute in the sale_buffer_time, current time is : "+newIndDate().toString());
//   console.log("Now checking past sales only");
//   const currdate = newIndDate();
//   Saleslist.find({endtime : { $lte : currdate}}).then(
//     listofsales => {
//       console.log("Total past sales"+listofsales.length.toString());
//       for(var i=0;i<listofsales.length;i++){
//         const ttimerun = sale_buffer_time*60*60*1000; // convert to miliseconds
//         const timepassed = currdate - listofsales[i].endtime;
//         if(timepassed>.25*ttimerun&&listofsales[i].notif_buy_tover4_sbt==false){
//           console.log("Found a sale for buy_t/4_sbt notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"t/4_sbt");
//         console.log("Sending t/4_sbt notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_tover4_sbt : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_tover4_sbt.toString());
//           });
//         }
//         if(timepassed>.50*ttimerun&&listofsales[i].notif_buy_2tover4_sbt==false){
//           console.log("Found a sale for buy_2t/4_sbt notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"2t/4_sbt");
//         console.log("Sending 2t/4_sbt notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_2tover4_sbt : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_2tover4_sbt.toString());
//           });
//         }
//         if(timepassed>.75*ttimerun&&listofsales[i].notif_buy_3tover4==false){
//           console.log("Found a sale for buy_3t/4_sbt notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"3t/4_sbt");
//         console.log("Sending 3t/4_sbt notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_3tover4_sbt : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_3tover4_sbt.toString());
//           });
//         }
//         if((ttimerun-timepassed)<60*60*1000&&listofsales[i].notif_buy_lasthour_sbt==false){
//           console.log("Found a sale for buy_last_hour_sbt notif");
//           let onesaleuser = [];
//         for(var j=0;j<listofsales[i].commits_for_this_sale.length;j++){
//           let item = listofsales[i].commits_for_this_sale[j];
//           mycommits.findOne({_id:item.id},function(err,doccommit){
//             if(err){
//               console.log("Error occured");
//             }
//             else{
//               onesaleuser.push(doccommit.User._id);
//               // sendtover4notif(doccommit.User._id,listofsales[i]._id);
//             }
//           });
//         }
//         sendcommitnotif(onesaleuser,listofsales[i]._id,"lasthour_sbt");
//         console.log("Sending lasthour_sbt notif");
//         console.log("ID of the sale is : "+listofsales[i]._id.toString());
//         Saleslist.findOneAndUpdate({_id:listofsales[i]._id},{
//           $set : {
//             notif_buy_lasthour_sbt : true
//           }
//         },{new:true}).then(
//           docsale2 => {
//             console.log("New doc sale param is "+docsale2.notif_buy_lasthour_sbt.toString());
//           });
//         }

//       }
//     }
//   ).catch(
//     (err) => {
//       console.log("error occured in findinf current sale")
//       console.log(err);
//     }
//   );

// });

// These notifs:
// 6. Thanks notifs :
//     a. Registering for the website
//     b. Making a commit/order.
// 7. Your comment just got published. Thanks for giving your feedback.
// 8. A gift card has been generated for your commit.
// 9. Order tracking notifs.
//will be sent from their respective events, not cron jobs.

module.exports = router;
