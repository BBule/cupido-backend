var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const Aftership = require("aftership")("59dd0bf9-7d7f-42e5-ba90-90de401acf9e");

var passportLocalMongoose = require("passport-local-mongoose");
//var methodOverride=require("method-override");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Watches = require("./models/watches");

var ExpressBrute = require("express-brute");

var store2 = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store2);

var nDate = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Calcutta"
});

// const port = process.env.PORT || 8080;
const helmet = require("helmet");
const path = require("path");
const favicon = require("serve-favicon");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("./lib/config.js");

mongoose.Promise = Promise;
mongoose.connect(
  config.db.url,
  {
    useMongoClient: true
  }
);
const oneitemincart = require("./models/oneitemincart");
const oneitemincommitcart = require("./models/oneitemincommitcart");
const adminsideorder = require("./models/adminsideorder");
const Products = require("./models/Products");
const mygifts = require("./models/mygifts");
const mycommits = require("./models/mycommits");
const Saleslist = require("./models/saleslist");
const oneorder = require("./models/oneorder");
const myorders = require("./models/myorders");
const anew = require("./models/anew");
var mycart = require("./models/mycart");
const Cart = require("./lib/Cart");
const Security = require("./lib/Security");
var oneAddress = require("./models/oneaddress");
var payumoney = require("payumoney-node");
payumoney.setKeys(
  "CEeUKiyZ",
  "2MK3evJw1C",
  "3fMtl+uId2uN/sFgSu5ObNGx+Bt1qoSO4zIFWGGlgjg="
);
const store = new MongoDBStore({
  uri: config.db.url,
  collection: config.db.sessions
});

app.locals.paypal = config.paypal;
app.locals.locale = config.locale;

app.use(favicon(path.join(__dirname, "favicon.png")));
app.use(
  "/public",
  express.static(path.join(__dirname, "/public"), {
    maxAge: 0,
    dotfiles: "ignore",
    etag: false
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  session({
    secret: "mandadbadjdajdabadjbdfjlsdbfjsdbfsdjfd",
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    unset: "destroy",
    store: store,
    expires: expiryDate,
    name: config.name + "-" + Security.generateId(),
    genid: req => {
      return Security.generateId();
    }
  })
);

// app.use(function(req,res,next){
//   var n = req.session.views || 0;
//   req.session.views = n++;
//   res.end(n+' views');
// });
// var timearray = ['44 * * * *','47 * * * *'];
//
// var schedule = require('node-schedule');
//
// var j = schedule.scheduleJob(timearray, function(){
//   console.log('The answer to life, the universe, and everything! india');
// });

var cron = require("node-schedule");

// All coming with GMT

var datearray = [];

Saleslist.find({}, function(req2, all) {
  datearray = all;
  console.log("Allsales");
  console.log(all);
});

// Mail tester

// Mailing functions

var nodemailer = require("nodemailer");

var sendregistermail = function sendregistermail(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html: "<b>Thanks for registering with us</b>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendsalebegins = function sendsalebegins(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html:
      "<b>A sale with sale ID has started. <a href='/'> Take me to sale.</a></b>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendsaleends = function sendsaleends(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html:
      "<b>A sale with sale ID is going to end in some time. <a href='/'> Take me to sale.</a></b>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendpayfullrequest = function sendpayfullrequest(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html: "Please pay full for the sale"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendthankstocommitmail = function sendthankstocommitmail(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html:
      "<b>Thanks for commiting to us. <a href='/'> Go to the sale and pay full amount.</a></b>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendthankstopayfullmail = function sendthankstopayfullmail(emailid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "getlow.bangalore@gmail.com",
      pass: "lowerlowest"
    }
  });

  var mailOptions = {
    from: "getlow.bangalore@gmail.com",
    to: emailid,
    subject: "Sending Email using Node.js",
    html:
      "<b>Thanks for paying us the full amount <a href='/' > for this sale </a></b>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

//sendregistermail('yashjaiswal1097@gmail.com');

cron.scheduleJob("* * * * *", function() {
  console.log("Cron called at ");
  console.log(new Date());
  var currdate = new Date().getTime();
  //console.log(new Date().getTime());
  for (var i = 0; i < datearray.length; i++) {
    //console.log("Start time : "+ datearray[i].starttime);
    console.log(
      "Time to start in hours" +
        (datearray[i].starttime - currdate) / (60 * 60 * 1000)
    );

    if (
      datearray[i].mailsent == 0 &&
      datearray[i].starttime - currdate <= 60 * 60 * 1000 &&
      currdate < datearray[i].starttime
    ) {
      //Mail before one hour of the sale
      console.log("Send the mail");
      console.log("Sale ID : " + datearray[i]._id);
      Saleslist.findOneAndUpdate(
        { _id: datearray[i]._id },
        { $set: { mailsent: 1 } },
        { new: true },
        function(err, doc) {
          if (err) {
            console.log("Something wrong when updating data!");
          }
          console.log(doc);
        }
      );
    } else if (datearray[i].mailsent == 1) {
      console.log("Mail was already sent");
    }
  }
});

// var date = new Date(2018, 6, 27, 10, 41, 30);
// cron.scheduleJob(date, function(){
//     console.log(new Date(), "Somthing important is going to happen today!");
// });

var schedule = require("node-schedule");
/* run the job at 18:55:30 on Dec. 14 2018*/
// 5:30am on December 21, 2012
/*var date = new Date(2018, 6, 26, 16, 18, 30);
cron.scheduleJob(date, function(){
    console.log(new Date(), "Somthing important is going to happen today!");
});

var rule = new schedule.RecurrenceRule();
rule.minute = [18,19,20,21];
rule.second = [0,30]

var j = schedule.scheduleJob(rule, function(){
  console.log(new Date());
});*/

var GoogleStrategy = require("passport-google-oauth2").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

var qs = require("querystring");
var http = require("http");
var request = require("request");

//required routes

var indexRoutes = require("./routes/index");
//var mailRoutes=require("./routes/mail");
var watchesRoutes = require("./routes/watches");
var cartroutes = require("./routes/cart");
//var mycart = require("./routes/mycart");

// mongoose.connect('mongodb://localhost:27017/dbgetlow');
mongoose.createConnection(
  "mongodb://getlow:lowerlowest1@ds131721.mlab.com:31721/getlow"
);

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(methodOverride("_method)"));

app.use(
  require("express-session")({
    secret: "getlow",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(watchesRoutes);
app.use(cartroutes);
//app.use(mailRoutes);
app.use(express.static("design"));

app.get("/practice", function(req, res) {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  let sess = req.session;

  console.log(getRandomInt(100));

  temp = new mycart({
    //Randomvalue : ["random"+getRandomInt(15),"random"+getRandomInt(15),"random"+getRandomInt(15)]
    product_feats: [
      { product_boolean: 0 }, // 0 for commit 1 for full
      { price: 400 },
      { quantity: 2 },
      { Net_Price: 800 },
      { date: "20/11/1986" },
      { id: { type: mongoose.Schema.Types.ObjectId, ref: "Products" } }
    ]
  });

  temp.save(function(err, done) {
    if (err) console.log(err);
    //  console.log(done);
    //return done(err, temp);
  });

  mycart.create({ product_feats: [{ size: "small" }] }, function(err, small) {
    if (err) return handleError(err);
    // saved!
  });

  mycart.find({}, function(err, all) {
    console.log("Into Find");
    console.log(all);
  });

  console.log("My cart exec");

  temp = new User({
    //Randomvalue : ["random"+getRandomInt(15),"random"+getRandomInt(15),"random"+getRandomInt(15)]
    email: "jain@jais.com"
  });

  temp.save(function(err, done) {
    if (err) console.log(err);
    //  console.log(done);
    //return done(err, temp);
  });
  User.findOne({}, function(err, all) {
    console.log("Into Find of user");
    //console.log(all);
  });

  res.send("Practice displayed");
});

app.get("/", function(req, res) {
  console.log("Home URL : " + req.url);
  console.log("Into home page PrintDebugger");
  console.log(req.user);
  if (req.user !== undefined) var currentUser = req.user.username;
  else currentUser = "";
  Saleslist.find({}, function(err, allsales) {
    if (err) {
      console.log(err);
    } else {
      var currurl = req.url;
      console.log("All sales");
      console.log(allsales);
      res.render("homepage.ejs", { products: allsales, currentUser, currurl });
    }
  });
});
// Lets make a boolean man
// This route creates comments, first take it to admin then if admin approves then publish it
// Make two DBs one of usercomments and one of adminapprovedcomments, things get deleted from usercommetns
// once they are no longer pending
app.post("/submitcomment", isLoggedIn, function(req, res) {
  var newcomment = new usercomment({
    rating: req.body.noofstars,
    text: req.body.text,
    user: req.user._id,
    prod: req.body.prodid,
    adminapproved: 0
    //product : { id : req.body.productid},
  });
  newcomment.save();
  Products.findOneandUpdate(
    { _id: req.body.prodid },
    { $push: { linkedcomments: newcomment._id } },
    function(err, docproduct) {
      if (err) console.log(err);
      else {
        console.log(docproduct);
        res.send("Comment submitted");
      }
    }
  );
});

// Show the admin about the list of pending comments
app.get("/admin/pendingcomments", function(req, res) {
  usercomment.find({ adminapproved: 0 }, function(err, doccomments) {
    if (err) console.log(err);
    else {
      res.render("pendingcomments.ejs", doccomments);
    }
  });
});

// Admin route to publish the comment
// Publish on the product page
// Delete from linkedcomments
// Delete from usercomments DB
// Move to adminapprovedcomments
// Move to adminapprovedcomments DB
app.post("/admin/publishcomment", function(req, res) {
  usercomment.findOneAndUpdate(
    { _id: req.body.commentid },
    { adminapproved: 1 },
    function(err, doccomment) {
      if (doccomment) {
        console.log(doccomment);
      }
    }
  );
});

app.get("/admin/createuserorder", isLoggedIn, function(req, res) {
  var curruser = req.user;
  var neworder = new oneorder({
    prodname: "Titan X",
    quantity: 4,
    price: 4000,
    net_price: 16000,
    shipping_address: "whitefield",
    billing_address: "springfield"
  });
  console.log(neworder);
  neworder.save();
  // User.findOneAndUpdate({_id:req.user._id},{$push: { mycarts: newitem} },function(err2,res2)
  User.findOneAndUpdate(
    { _id: curruser._id },
    { $push: { myorders: neworder } },
    function(err, res) {
      if (err) console.log(err);
      else console.log(res);
    }
  );
  res.send("creatr user order");
});

app.get("/admin/createaso", function(req, res) {
  var newadminsideorder = new adminsideorder({
    order: { id: "5b780db5560367304629949f" },
    customername: "Bhupendra Bule",
    prodordered: "Titan X",
    tracking_number: "75122059401"
  });
  newadminsideorder.save(function(err, resp) {
    if (err) {
      console.log(err);
    } else {
      console.log(resp);
    }
  });
  res.send("Created");
});

app.get("/admin/trackingportal", function(req, res) {
  console.log("into admin track portal");
  adminsideorder.find({}, function(err, alldoc) {
    if (err) {
      console.log(err);
    }
    console.log(alldoc);
    res.render("Tracking.ejs", { alldoc: alldoc });
  });
});

app.get("/trackmyorder", isLoggedIn, function(req, res) {
  res.render("usertrackorder.ejs");
});

// app.post("/trackuserorder",function(req,res){
//   var trackingid = req.body.trackingid,
//
//   let body = {
//       'tracking': {
//           'slug': 'bluedart',
//           'tracking_number': trackingid,
//           'title': 'Title Name',
//           'smses': [
//               '+18555072509',
//               '+18555072501'
//           ],
//           'emails': [
//               'email@yourdomain.com',
//               'another_email@yourdomain.com'
//           ],
//           'order_id': 'ID 1234',
//           'order_id_path': 'http://www.aftership.com/order_id=1234',
//           'custom_fields': {
//               'product_name': 'iPhone Case',
//               'product_price': 'USD19.99'
//           }
//       }
//   };
//   Aftership.call('POST', '/trackings', {
//   	body: body
//   }, function (err, result) {
//   	// Your code here
//     console.log(result);
//   });
//
//   let query = {
//   	slug: 'bluedart'
//   };
//   Aftership.call('GET', '/trackings', {
//   	query: query
//   }, function (err, result) {
//   console.log(result.data.trackings[0].checkpoints);
//   	// Your code here
// });
// });

app.post("/admin/submittrackid", function(req, res) {
  oneorder.findOneAndUpdate(
    { _id: req.body.orderid },
    { $set: { tracking_number: req.body.trackid } },
    { new: true },
    function(err, orderdoc) {
      if (err) {
        console.log(err);
      } else {
        console.log(orderdoc);
      }
    }
  );
  res.redirect("/admin/trackingportal");
});

// Payu money block

payumoney.isProdMode(false);

app.get("/makepayurequest", function(req, res) {
  var paymentData = {
    productinfo: "TitanX",
    txnid: "rjtxnid",
    amount: "5",
    email: "bhupendra938@gmail.com",
    phone: "9641222292",
    lastname: "Bule",
    firstname: "Bhupendra",
    surl: "http://localhost:3000/payu/success", //"http://localhost:3000/payu/success"
    furl: "http://localhost:3000/payu/fail" //"http://localhost:3000/payu/fail"
  };

  payumoney.makePayment(paymentData, function(error, response) {
    if (error) {
      console.log(error);
      // Some error
    } else {
      // Payment redirection link
      console.log(response);
    }
  });
  res.send("Done");
});

app.get("/getpayurequest", function(req, res) {
  payumoney.paymentResponse({}, function(error, response) {
    if (error) {
      // Some error
      console.log(error);
    } else {
      console.log(response);
      res.send("Gotten");
    }
  });
});

function tellmecurrprice(pricemarkersofthissale, current_quantity_sold) {
  console.log("into tell fxn");
  var promise = new Promise(function(resolve, reject) {
    var tempans = pricemarkersofthissale[0][1];
    console.log("PM of this sale");
    console.log(pricemarkersofthissale);
    for (var i = 0; i < pricemarkersofthissale.length; i++) {
      if (current_quantity_sold >= pricemarkersofthissale[i][0]) {
        tempans = pricemarkersofthissale[i][1];
      }
    }
    console.log("Returnde ans from fxn");
    console.log(tempans);
    resolve(tempans);
  });
  return promise;
}

app.get("/testcart", function(req, res) {
  res.render("testcart.ejs");
});

app.post("/addtocart", isLoggedIn, function(req, res) {
  // Requires prod title
  //
  var prodtitle = req.body.bvalue;
  //  prodtitle = "fossil12 Grey Men's Watch - RTP-7891",
  //var quantity = req.body.quantity;
  var quantity = 1;
  var redirecturl = req.body.pageurl;
  redirecturl = "/";
  console.log("RU : " + redirecturl);
  var pricemarkersofthissale;
  var current_quantity_sold;
  Saleslist.findOne({ _id: req.body.saleid }, function(err, docsale) {
    pricemarkersofthissale = docsale.pricemarkers;
    current_quantity_sold = docsale.quantity_sold;
    var currentbuyprice;
    tellmecurrprice(pricemarkersofthissale, current_quantity_sold).then(
      function(result) {
        console.log("Current price ofxn" + result);
        currentbuyprice = result;
        var newitem = new oneitemincart({
          prodname: prodtitle,
          quantity: 1,
          price: currentbuyprice, // Fixed for now
          sale: { id: docsale._id }
        });
        console.log("New item was created");
        newitem.save();
        console.log(newitem);

        User.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { mycarts: newitem } },
          function(err2, res2) {
            if (err2) console.log(err2);
            else console.log(res2);
          }
        );
        res.redirect(redirecturl);
      }
    );
  });
});
// Copy paste from add to cart
app.post("/addtocommitcart", isLoggedIn, function(req, res) {
  // Requires prod title
  //
  var prodtitle = req.body.bvalue2;
  //  prodtitle = "fossil12 Grey Men's Watch - RTP-7891",
  //var quantity = req.body.quantity;
  var quantity = 1;
  var redirecturl = req.body.pageurl2;
  redirecturl = "/";
  console.log("RU : " + redirecturl);
  var pricemarkersofthissale;
  var current_quantity_sold;
  Saleslist.findOne({ _id: req.body.saleid2 }, function(err, docsale) {
    pricemarkersofthissale = docsale.pricemarkers;
    current_quantity_sold = docsale.quantity_sold;
    var currentbuyprice;
    tellmecurrprice(pricemarkersofthissale, current_quantity_sold).then(
      function(result) {
        console.log("Current price ofxn" + result);
        currentbuyprice = result;
        var newitem = new oneitemincommitcart({
          prodname: prodtitle,
          quantity: quantity,
          price: currentbuyprice, // Fixed for now
          commit_amount: docsale.pricemarkers[3][1],
          amount_paid: 1000,
          commit_date: new Date(),
          sale: {
            id: docsale._id,
            endtime: docsale.endtime,
            pricemarkers: docsale.pricemarkers
          }
        });
        console.log("New item was created");
        newitem.save();
        console.log(newitem);

        User.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { mycommits: newitem } },
          function(err2, res2) {
            if (err2) console.log(err2);
            else console.log(res2);
          }
        );
        res.redirect(redirecturl);
      }
    );
  });
});

app.get("/checkoutcart", isLoggedIn, function(req, res) {
  var currentcart = req.user.mycarts;
  console.log(currentcart);
  var totalprice = 0;
  for (var i = 0; i < currentcart.length; i++) {
    totalprice += currentcart[i].price;
  }
  res.render("checkoutcart.ejs", { cartitems: currentcart, totalprice });
});

app.get("/checkoutcommits", isLoggedIn, function(req, res) {
  var currentcart = req.user.mycommits;
  console.log(currentcart);
  var totalprice = 0;
  for (var i = 0; i < currentcart.length; i++) {
    totalprice += currentcart[i].price;
  }
  res.render("checkoutcommits.ejs", { cartitems: currentcart, totalprice });
});

app.get("/views", function(req, res) {
  console.log(req);
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

// Make Payment Request in this route
app.get("/processcart", isLoggedIn, function(req, res) {
  console.log("Here processing the cart");
  var curruser = req.user;
  console.log("Current user");
  console.log(curruser);
  User.findOne({ _id: curruser._id }, function(err, docuser) {
    console.log("Docuser " + docuser);
    for (var i = 0; i < docuser.mycarts.length; i++) {
      console.log("Iterating");
      Saleslist.findOne({ _id: docuser.mycarts[i].sale.id }, function(
        err2,
        docsale
      ) {
        if (err2) console.log(err2);
        console.log(docsale);
      });
      Saleslist.findOneAndUpdate(
        { _id: docuser.mycarts[i].sale.id },
        { $inc: { quantity_sold: docuser.mycarts[i].quantity } },
        function(err2, docsale) {
          console.log(docsale);
        }
      );
      // change inventoey here
      // save user here
    }
  });
  res.send("Payment Portal");
});

app.get("/processcommits", isLoggedIn, function(req, res) {
  console.log("Here processing the commits");
  var curruser = req.user;
  console.log("Current user");
  console.log(curruser);
  User.findOne({ _id: curruser._id }, function(err, docuser) {
    console.log("Docuser " + docuser);
    for (var i = 0; i < docuser.mycommits.length; i++) {
      console.log("Iterating");
      Saleslist.findOneAndUpdate(
        { _id: docuser.mycommits[i].sale.id },
        { quantity_sold: quantity_sold - docuser.mycommits.quantity },
        function(err2, docsale) {
          console.log(docsale);
        }
      );
      // change inventory here
      // save user here
    }
  });
  res.send("Payment Portal");
});

app.get("/items", (req, res) => {
  console.log("fe");
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totals: 0.0,
      formattedTotals: ""
    };
  }
  Products.find({ price: { $gt: 0 } })
    .sort({ price: -1 })
    .limit(6)
    .then(products => {
      let format = new Intl.NumberFormat(req.app.locals.locale.lang, {
        style: "currency",
        currency: req.app.locals.locale.currency
      });
      products.forEach(product => {
        product.formattedPrice = format.format(product.price);
      });
      res.render("index.ejs", {
        pageTitle: "Node.js Shopping Cart",
        products: products,
        nonce: Security.md5(req.sessionID + req.headers["user-agent"])
      });
    })
    .catch(err => {
      res.status(400).send("Bad request");
    });
});

// Show content from DB
app.get("/cart", (req, res) => {
  let sess = req.session;
  let cart = typeof sess.cart !== "undefined" ? sess.cart : false;
  res.render("cart.ejs", {
    pageTitle: "Cart",
    cart: cart,
    nonce: Security.md5(req.sessionID + req.headers["user-agent"])
  });
});

// Remove cart item from DB
app.get("/cart/remove/:id/:nonce", (req, res) => {
  let id = req.params.id;

  if (/^\d+$/.test(id) || Security.isValidNonce(req.params.nonce, req)) {
    // console.log("hellp "+id);

    Cart.removeFromCart(id, req.session.cart);
    res.redirect("/cart");
  } else {
    res.redirect("/");
  }
});

// Empty all cart
app.get("/cart/empty/:nonce", (req, res) => {
  if (Security.isValidNonce(req.params.nonce, req)) {
    Cart.emptyCart(req);
    res.redirect("/cart");
  } else {
    res.redirect("/");
  }
});

// Add item to cart
app.post("/cart", (req, res) => {
  let qty = parseInt(req.body.qty, 10);
  console.log("hello");
  let product = req.body.product_id;
  console.log("bb" + product + "final");
  if (qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Products.findOne({ _id: product })
      .then(prod => {
        let cart = req.session.cart ? req.session.cart : null;
        console.log("cart" + cart);
        Cart.addToCart(prod, qty, cart);
        res.redirect("/cart");
      })
      .catch(err => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
});

// No idea
app.post("/cart/update", (req, res) => {
  let ids = req.body["product_id[]"];
  let qtys = req.body["qty[]"];
  if (Security.isValidNonce(req.body.nonce, req)) {
    let cart = req.session.cart ? req.session.cart : null;
    let i = !Array.isArray(ids) ? [ids] : ids;
    let q = !Array.isArray(qtys) ? [qtys] : qtys;
    Cart.updateCart(i, q, cart);
    res.redirect("/cart");
  } else {
    res.redirect("/");
  }
});

// Get req to checkout
app.get("/checkout", (req, res) => {
  let sess = req.session;
  let cart = typeof sess.cart !== "undefined" ? sess.cart : false;
  res.render("checkout.ejs", {
    pageTitle: "Checkout",
    cart: cart,
    checkoutDone: false,
    nonce: Security.md5(req.sessionID + req.headers["user-agent"])
  });
});

// Post req to checkout
app.post("/checkout", (req, res) => {
  let sess = req.session;
  let cart = typeof sess.cart !== "undefined" ? sess.cart : false;
  if (Security.isValidNonce(req.body.nonce, req)) {
    res.render("checkout.ejs", {
      pageTitle: "Checkout",
      cart: cart,
      checkoutDone: true
    });
  } else {
    res.redirect("/");
  }
});

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

///
app.get("/watches", function(req, res) {
  // amazon.products.createIndex( { "googleId": 1 }, { unique: true } );

  Products.create(
    {
      title: "Tots Grey Men's Watch - RTP-7895",
      Category: "Watches",
      image:
        "https://demo.weebpal.com/marketplace/sites/default/files/products/rolex-submariner-black-dial-stainless.jpg",
      description: " very good Watch",
      price: 18250,
      brand: "Tots",
      gender: 0
    },
    function(err, watch) {
      // Watches.save();
      if (err) console.log(err);
      else {
        console.log(watch);
        res.send("Watches worked");
      }
    }
  );
});

app.get("/anew", function(req, res) {
  console.log("Anew called");
  var anew2 = new anew({
    name: "Haaia"
  });
  //console.log(anew2);

  anew2.save(function(err, resa) {
    if (err) console.log(err);
    else console.log(resa);
  });
  anew.find({}, function(req2, allanew) {
    console.log(allanew);
  });
  res.send("Anew executed");
});

// Tester functions

app.get("/createsale", function(req, res) {
  // amazon.products.createIndex( { "googleId": 1 }, { unique: true } );

  var prodid = "5b72c0a6dbe3810b64d19b31";
  var date1 = new Date(2018, 6, 27, 9, 0, 0).getTime(); // data input is utc
  var hh = 2000; // Duration of sale
  var ttg = 0;
  date1 = date1 + 5.5 * 60 * 60 * 1000 + ttg;
  date2 = date1 + hh * 60 * 60 * 1000;
  //console.log(new Date(date).toUTCString());

  // VERY IMPORTANT
  // var date = new Date('Tue Jul 29 2014 23:44:06 GMT+0000 (UTC)').getTime();
  // date += (2 * 60 * 60 * 1000);
  // console.log(new Date(date).toUTCString());
  // Hint : Change type to string in the schema
  // If you want to schedule according to some date

  Products.findOne({ _id: prodid }, function(req2, res2) {
    console.log("Print the found prod : " + res2._id);
    //console.log(res);
    console.log("Difference in time " + (date2 - date1));

    Saleslist.create(
      {
        product: { id: res2._id },
        starttime: new Date(date1),
        endtime: new Date(date2),
        pricemarkers: [[0, 1000], [100, 900], [250, 750]], // Quantity,Price
        mailsent: 0,
        quantity_sold: 214
      },
      function(err, watch) {
        // Watches.save();
        if (err) console.log(err);
        else {
          console.log(watch);
          res.send("Sales worked");
        }
      }
    );
  });
});

app.get("/creategift", function(req, res) {
  var newgift = new mygifts({
    giftcode: "ASD0501",
    discount: 700,
    specificcommit: { id: "5b6c39faada050367083f7f1" }
  });
  console.log("New gift was created");
  newgift.save();
  console.log(newgift);

  User.findOneAndUpdate(
    { email: "yashshraddha@gmail.com" },
    { $push: { mygifts: newgift } },
    function(err, res) {
      if (err) console.log(err);
      else console.log(res);
    }
  );

  // User.findOne({email:"yashshraddha@gmail.com"},function(err,curruser){
  //   if(err) console.log(err);
  //   else console.log(curruser);
  //   console.log("Gifts of the user : ");
  //   console.log(curruser.mygifts);
  //   console.log("ID of the new gift " + newgift._id);
  //   curruser.username = "shraddha";
  //   var arr = curruser.mygifts;
  //   arr.push("No push");
  //   console.log("Array "+arr);
  //   curruser.mygifts.push(newgift._id);
  //   console.log("CU after update :"+curruser);
  //
  //   curruser.save(function(err){
  //     if(err) {console.log("Saving error"); console.log(err); }
  //   });
  // });
  res.redirect("/");
});

// Submit Address Route
app.post("/submitaddress", function(req, res) {
  var curruser = req.user;
  User.findOne({ _id: curruser._id }, function(err, docuser) {
    if (err) {
      console.log("ERR");
    } else {
      console.log("New params : ");
      console.log("Contact : " + req.body.contact);
      var myaddress = new oneAddress({
        username: req.body.name,
        useremail: req.body.email,
        contact: req.body.contact,
        address: req.body.address1,
        landmark: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
      });
      myaddress.save(function(err2, docaddress) {
        if (err2) {
          console.log("ERR2");
        } else {
          console.log("New address is : ");
          console.log(myaddress);
        }
      });
      User.findOneAndUpdate(
        { _id: curruser._id },
        { $push: { myaddresses: myaddress } },
        function(err, resa) {
          if (err) console.log(err);
          else console.log(resa);
        }
      );
    }
  });

  res.send("End of post route");
});

app.get("/product/:prodname", function(req, res) {
  console.log("Hit route : " + req.params.prodname);
  var prodname = req.params.prodname.replace(/_/g, " ");
  var currentuser = req.user;
  console.log("Prod Name : ");
  console.log(prodname);
  Products.findOne({ title: prodname }, function(err, docprod) {
    if (err) {
      console.log(err);
    } else {
      if (currentuser == undefined) {
        var currentUser = "";
      } else {
        currentUser = req.user.username;
      }
      console.log("Docprod " + docprod);
      var currtime = new Date();
      console.log("Current time is : ");
      console.log(currtime);
      Saleslist.findOne({ "product.id": docprod._id }, function(
        errsale,
        docsale
      ) {
        if (errsale) {
          console.log("Err");
        } else if (docsale != null) {
          console.log("docsale");
          console.log(docsale);
          //res.render("product.ejs");
          res.render("product.ejs", {
            docprod: docprod,
            docsale: docsale,
            currentUser
          });
          // res.send("Hua");
        }
      });
    }
  });
});

// Delete address route
app.post("/deleteaddress/:id", function(req, res) {
  var currentuser = req.user;
  var addressid = req.params.id;
  var deletionaddr;
  oneAddress.findOne({ _id: addressid }, function(err, doconeaddress) {
    if (err) {
      console.log(err);
    }
    deletionaddr = doconeaddress;
  });
  oneAddress.findOneAndRemove({ _id: addressid }, function(err, doconeaddress) {
    if (err) {
      console.log(err);
    }
  });
  User.findOneAndUpdate(
    { _id: currentuser._id },
    { $pullAll: { myaddresses: deletionaddr } },
    function(erruser, docuser) {
      if (erruser) {
        console.log(erruser);
      }
    }
  );
  res.send("Address updated");
});

app.get("/createcommit", function(req, res) {
  Saleslist.find({ _id: "5b6d802589e3eb34569fe4af" }, function(err, onesale) {
    console.log("Sale created : ");
    console.log(onesale);
    console.log("Length of onesale : " + onesale.length);
    var qsold = onesale[0].quantity_sold;
    var pm = onesale[0].pricemarkers;
    console.log("Params : " + qsold + pm);
    var newcommit = new mycommits({
      commit_date: new Date(),
      commit_amount: 1800,
      amount_paid: 180,
      commit_quantity: 1,
      estimated_delivery: ["28/08/2018", "29/08/2018"], // DD/MM/YYYY
      thissale: { id: "5b6d802589e3eb34569fe4af", ending_time: 20 },
      current_quantity_sold: qsold,
      price_markers: pm,
      thisproduct: { id: "5b58bc5949c7a853a86b6dcb", title: "Manhattan Watch" }
    });
    newcommit.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Saved new commit is" + newcommit);
      }
    });
    console.log("Price markers are " + onesale.pricemarkers);
    console.log("New commit was created");
    console.log(newcommit);

    User.findOneAndUpdate(
      { email: "yashshraddha@gmail.com" },
      { $push: { mycommits: newcommit } },
      function(err, res) {
        if (err) console.log(err);
        else console.log(res);
      }
    );
    res.redirect("/");
  });
});

app.get("/pastsales", function(req, res) {
  var date1 = new Date();
  date1 = date1.getTime() + 5.5 * 60 * 60 * 1000;
  console.log(date1);
  var salesholder;
  Saleslist.find({ endtime: { $lte: date1 } })
    .sort("endtime")
    .exec(function(err, all) {
      if (all) {
        if (all.length != 0) {
          console.log(all);
          console.log("Differences : " + (all[0].starttime - date1));
          salesholder = all;
          for (var i = 0; i < salesholder.length; i++) {
            console.log("Salesholder : ");
            for (var j = 0; j < salesholder[i].pricemarkers.length; j++) {
              console.log(
                salesholder[i].pricemarkers[j][0] +
                  " : " +
                  salesholder[i].pricemarkers[j][0]
              );
            }
          }
        }
      } else {
        console.log("No results found");
      }
      res.send("Past Sales Page");
    });
});

app.get("/currentsales", function(req, res) {
  var date1 = new Date();
  date1 = date1.getTime() + 5.5 * 60 * 60 * 1000;
  console.log(date1);
  var salesholder;
  Saleslist.find({ endtime: { $gte: date1 }, starttime: { $tlte: date1 } })
    .sort("endtime")
    .exec(function(err, all) {
      console.log(all);
      if (all) {
        if (all.length != 0) {
          console.log(all);
          console.log("Differences : " + (all[0].starttime - date1));
          salesholder = all;
          for (var i = 0; i < salesholder.length; i++) {
            console.log("Salesholder : ");
            for (var j = 0; j < salesholder[i].pricemarkers.length; j++) {
              console.log(
                salesholder[i].pricemarkers[j][0] +
                  " : " +
                  salesholder[i].pricemarkers[j][0]
              );
            }
          }
        }
      } else {
        console.log("No results found");
      }
      res.send("Current Sales Page");
    });
});

app.get("/futuresales", function(req, res) {
  var date1 = new Date();
  date1 = date1.getTime() + 5.5 * 60 * 60 * 1000;
  console.log(date1);
  var salesholder;
  // Error returning an empty array instead of null
  // Temporary measure has been taken
  Saleslist.find({ starttime: { $gte: date1 } })
    .sort("starttime")
    .exec(function(err, all) {
      console.log(all);
      if (all) {
        if (all.length != 0) {
          console.log(all);
          console.log("Differences : " + (all[0].starttime - date1));
          salesholder = all;
          for (var i = 0; i < salesholder.length; i++) {
            console.log("Salesholder : ");
            for (var j = 0; j < salesholder[i].pricemarkers.length; j++) {
              console.log(
                salesholder[i].pricemarkers[j][0] +
                  " : " +
                  salesholder[i].pricemarkers[j][0]
              );
            }
          }
        }
      } else {
        console.log("No results found");
      }

      res.send("Future Sales Page");
    });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function alreadyLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Right now user can't see his watched products
app.get("/addtowatchlist", isLoggedIn, function(req, res) {
  var prodid = "5b58bc5949c7a853a86b6dcb";
  console.log(req.session.passport.user._id);
  var userid = req.session.passport.user._id;
  // find by document id and update and push item in array
  Products.findByIdAndUpdate(
    prodid,
    { $addToSet: { watchlist: userid } },
    { safe: true, upsert: true },
    function(err, doc2) {
      if (err) {
        console.log(err);
      } else {
        //do stuff
        console.log(doc2);
      }
    }
  );

  res.send("You have subscribed to our product");
});

app.get("/addtolikelist", isLoggedIn, function(req, res) {
  var prodid = "5b58bc5949c7a853a86b6dcb";
  console.log(req.session.passport.user._id);
  var userid = req.session.passport.user._id;
  // find by document id and update and push item in array
  Products.findByIdAndUpdate(
    prodid,
    { $addToSet: { likelist: userid } },
    { safe: true, upsert: true },
    function(err, doc2) {
      if (err) {
        console.log(err);
      } else {
        //do stuff
        console.log(doc2);
      }
    }
  );

  res.send("You have liked to our product");
});

app.get("/account", isLoggedIn, function(req, res) {
  var currentUser = req.user.username;
  console.log("Current usr" + currentUser);
  User.findOne({ _id: req.user._id }, function(req, userone) {
    console.log(userone);
    var giftdata = userone.mygifts;
    var personaldata = userone.mygifts;
    console.log(giftdata.length);
    var activecommitdata = userone.mycommits;
    var address = userone.myaddresses;
    //var activecommitdata;
    console.log("Active : ");

    // console.log(activecommitdata[0]);
    // console.log(activecommitdata[0].price_markers);
    for (var i = 0; i < activecommitdata.length; i++) {
      Saleslist.findOne({ _id: activecommitdata[i].sale.id }, function(
        err,
        docsale
      ) {
        var pricemarkersofthissale = docsale.pricemarkers;
        var current_quantity_sold = docsale.quantity_sold;
        tellmecurrprice(pricemarkersofthissale, current_quantity_sold).then(
          function(result) {
            console.log("Price set to : " + result);
            activecommitdata[i].price = result;
          }
        );
      });
    }
    res.render("account.ejs", {
      activecommitdata: activecommitdata,
      address: address,
      personaldata: personaldata,
      giftdata: giftdata,
      currentUser
    });
  });
});
app.get("/confirmation", function(req, res) {
  res.render("confirmation.ejs");
});
app.get("/popup", function(req, res) {
  res.render("popup.ejs");
});
app.get("/ajax", function(req, res) {
  Products.find({}, function(err, all) {
    if (err) {
      console.log("hi");
    } else res.render("ajax.ejs", { products: all });
  });
});

app.get("*", function(req, res) {
  res.render("noroute.ejs", { req: req });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
});
