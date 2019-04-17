const express = require("express");
const router = express.Router();

// Helper Functions
function newIndDate() {
  var nDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Calcutta"
  });
  return nDate;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("Login required");
}

// Models
const User = require("../models/user");
const Products = require("../models/Products");
const Saleslist = require("../models/saleslist");
const mycartingeneral = require("../models/mycartingeneral");
const mygifts = require("../models/mygifts");
const mycomments = require("../models/mycomments");
const mycommits = require("../models/mycommits");
// const allinventory = require('../models/allinventory');
const myorders = require("../models/myorders");
const categorylist = require("../models/categorylist");

// Temp check route
router.get("/pug", function(req, res) {
  res.send("Hi");
});

// API end point to route the category page
// /api/sales/category=watches&gender=m&status=live&limit=10&offset=15
// if category is valid, then check for gender, then check for status then query db for limits and offset
// Currently the sales are sorted on the basis of values of page hits and time left.
// Formula: 0.33*page_hits/max(time_left in seconds,1000)
// Applied check when data is present
router.get(
  "/api/sales/category=:categoryname&gender=:gender&status=:status&limit=:lvalue&offset=:ovalue",
  (req, res) => {
    console.log("Requesting saleslist page");
    const categoryname = req.params.categoryname;
    const gender = req.params.gender;
    const status = req.params.status;
    const lvalue = req.params.lvalue;
    const offset = req.params.ovalue;

    console.log(categoryname);
    // categorylist.findOne({category_name:categoryname},function(err,onecategory){
    //   if(err){
    //     console.log("Error");
    //     console.log(err);
    //     res.status(200).send({
    //       error_value :  "error"
    //     });
    //   }
    //   else if(!onecategory){ // intended category is not found
    //     console.log("Not a category");
    //     res.status(200).send({
    //     warning : "doc category not found"
    //   });
    //   }
    /*else*/ if (
      /*onecategory&&*/ (gender == "M" || gender == "F") &&
      status == "live"
    ) {
      var currdate = newIndDate();
      var genderofsale = gender == "M" ? false : true;
      console.log(genderofsale);
      Saleslist.find({
        "product.category": categoryname /*gender:genderofsale,*/,
        endtime: { $gte: currdate },
        starttime: { $lte: currdate }
      })
        .then(listofsales => {
          console.log("Category found : ");
          console.log(listofsales);
          console.log(gender == "M" ? false : true);
          salesholder = listofsales;
          salesholder.sort(function(a, b) {
            const ttl1 = a.endtime - currdate;
            const ttl2 = b.endtime - currdate;
            a.macho_factor = (0.33 * a.sale_visits) / Math.max(ttl1, 1000);
            b.macho_factor = (0.33 * b.sale_visits) / Math.max(ttl2, 1000);
            return b.macho_factor - a.macho_factor;
          });
        })
        .then(() => {
          var queryParams = salesholder;
          var startpoint = req.params.ovalue; // zero
          var howmany = req.params.lvalue; // ten
          res.status(200).send({
            listofsales: queryParams.splice(startpoint, howmany)
          });
        });
    } else {
      res.status(200).send({
        error: "Some other error"
      });
    }
  }
);
// });

// API end point to route traffic of product page
router.get("/api/products/:prodname", (req, res) => {
  var prodname = req.params.prodname.replace(/_/g, " ");
  var productholder;
  Products.findOne({ title: prodname })
    .then(result => {
      productholder = result;
    })
    .then(() => {
      if (productholder == null || productholder.length == 0) {
        console.log("No products found");
        res.status(200).send({
          productdata: "No products found"
        });
      } else {
        console.log("Product is found and it's category: ");
        console.log(productholder.Category);
        res.status(200).send({
          productdata: productholder
        });
      }
    })
    .catch(err => {
      res.status(400).send("Bad request");
    });
});

// API end point to route traffic of my addresses page
// To check isLoggedIn function, currently disabled.
// Also after login the route takes him to the exact same page
router.get(
  "/api/userid=:curruser/myaddresses/limit=:lvalue&offset=:ovalue",
  (req, res) => {
    var addressholder;
    var curruser = req.params.curruser;
    User.findOne({ _id: curruser })
      .then(result => {
        addressholder = result.myaddresses; // Array of addresses of the current user
      })
      .then(() => {
        if (addressholder == null || addressholder.length == 0) {
          console.log("No addresses found");
          res.status(200).send({
            addressdata: "No addresses found"
          });
        } else {
          var startpoint = req.params.ovalue; // zero
          var howmany = req.params.lvalue; // ten
          console.log("Address is found and it's city: ");
          console.log(addressholder[0].city);
          res.status(200).send({
            addressdata: addressholder.splice(startpoint, howmany)
          });
        }
      })
      .catch(err => {
        res.status(400).send("Bad request");
      });
  }
);

// API end point to route traffic of mygifts page
// To check isLoggedIn function, currently disabled.
// Also after login the route takes him to the exact same page
router.get(
  "/api/userid=:curruser/mygifts/limit=:lvalue&offset=:ovalue",
  (req, res) => {
    var giftsholder;
    var curruser = req.params.curruser;
    console.log(req.originalUrl);
    User.findOne({ _id: curruser })
      .then(result => {
        giftsholder = result.mygifts; // Array of gifts of the current user
      })
      .then(() => {
        if (giftsholder == null || giftsholder.length == 0) {
          console.log("No gifts found");
          res.status(200).send({
            giftsdata: "No gifts found"
          });
        } else {
          var startpoint = req.params.ovalue; // zero
          var howmany = req.params.lvalue; // ten
          console.log("gift is found and it's code: ");
          console.log(giftsholder[0].giftcode);
          res.status(200).send({
            giftsdata: giftsholder.splice(startpoint, howmany)
          });
        }
      })
      .catch(err => {
        res.status(400).send("Bad request");
      });
  }
);

// API end point to route traffic of myorders page
// To check isLoggedIn function, currently disabled.
// Also after login the route takes him to the exact same page
router.get(
  "/api/userid=:curruser/myorders/limit=:lvalue&offset=:ovalue",
  (req, res) => {
    var ordersholder;
    var curruser = req.params.curruser;
    console.log(req.originalUrl);
    User.findOne({ _id: curruser })
      .then(result => {
        ordersholder = result.myorders; // Array of orders of the current user
      })
      .then(() => {
        if (ordersholder == null || ordersholder.length == 0) {
          console.log("No orders found");
          res.status(200).send({
            ordersdata: "No orders found"
          });
        } else {
          var startpoint = req.params.ovalue; // zero
          var howmany = req.params.lvalue; // ten
          console.log("order is found and it's amount: ");
          console.log(ordersholder[0].order_amount);
          res.status(200).send({
            ordersdata: ordersholder.splice(startpoint, howmany)
          });
        }
      })
      .catch(err => {
        res.status(400).send("Bad request");
      });
  }
);

// API end point to route traffic of mycarts page, split into commit and buy now
// To check isLoggedIn function, currently disabled.
// Also after login the route takes him to the exact same page
router.get(
  "/api/userid=:curruser/mycarts/limit=:lvalue&offset=:ovalue&type=:type",
  (req, res) => {
    var cartsholder;
    var curruser = req.params.curruser;
    var typeofcart = req.params.type;
    console.log(req.originalUrl);
    if (typeofcart == "commit") {
      User.findOne({ _id: curruser, "mycarts.is_commit": true })
        .then(result => {
          cartsholder = result.mycarts; // Array of carts of the current user
        })
        .then(() => {
          if (cartsholder == null || cartsholder.length == 0) {
            console.log("No carts found");
            res.status(200).send({
              ordersdata: "No carts found"
            });
          } else {
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            console.log("carts is found and it's product marketprice: ");
            console.log(cartsholder[0].Product.marketPrice);
            res.status(200).send({
              cartsdata: cartsholder.splice(startpoint, howmany)
            });
          }
        })
        .catch(err => {
          res.status(400).send("Bad request");
        });
    } else {
      User.findOne({ _id: curruser, "mycarts.is_commit": false })
        .then(result => {
          cartsholder = result.mycarts; // Array of carts of the current user
        })
        .then(() => {
          if (cartsholder == null || cartsholder.length == 0) {
            console.log("No carts found");
            res.status(200).send({
              ordersdata: "No carts found"
            });
          } else {
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            console.log("carts is found and it's product marketprice: ");
            console.log(cartsholder[0].Product.marketPrice);
            res.status(200).send({
              cartsdata: cartsholder.splice(startpoint, howmany)
            });
          }
        })
        .catch(err => {
          res.status(400).send("Bad request");
        });
    }
  }
);

// API end point to route traffic of mycommits page, split into active and missed
// To check isLoggedIn function, currently disabled.
// Also after login the route takes him to the exact same page
// Remember the commits are refrenced
router.get(
  "/api/userid=:curruser/mycommits/limit=:lvalue&offset=:ovalue&type=:type",
  (req, res) => {
    var commitholder;
    var curruser = req.params.curruser;
    var typeofcommit = req.params.type;
    console.log(req.originalUrl);
    if (typeofcommit == "active") {
      User.findOne({ _id: curruser, "mycommits.is_active": true })
        .then(result => {
          commitsholder = result.mycommits; // Array of commits of the current user
        })
        .then(() => {
          if (commitsholder == null || commitsholder.length == 0) {
            console.log("No commits found");
            res.status(200).send({
              commitsdata: "No commits found"
            });
          } else {
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            console.log("commits is found and it's product marketprice: ");
            var commitfullholder = [];
            // console.log(commitsholder[0].Product.marketPrice);
            for (var i = 0; i < commitsholder.length; i++) {
              mycommits
                .findOne({ _id: commitholder[i], is_active: true })
                .then(resultcommit => {
                  commitfullholder.push(resultcommit);
                });
            }
            if (commitfullholder == null || commitfullholder.length == 0) {
              console.log("No commits found");
              res.status(200).send({
                commitsdata: "No commits found"
              });
            }
            res.status(200).send({
              commitsdata: commitfullholder.splice(startpoint, howmany)
            });
          }
        })
        .catch(err => {
          res.status(400).send("Bad request");
        });
    } else {
      User.findOne({ _id: curruser, "mycommits.is_active": false })
        .then(result => {
          commitsholder = result.mycommits; // Array of carts of the current user
        })
        .then(() => {
          if (commitsholder == null || commitsholder.length == 0) {
            console.log("No commits found");
            res.status(200).send({
              commitsdata: "No commits found"
            });
          } else {
            var startpoint = req.params.ovalue; // zero
            var howmany = req.params.lvalue; // ten
            console.log("commits is found and it's product marketprice: ");
            var commitfullholder = [];
            // console.log(commitsholder[0].Product.marketPrice);
            for (var i = 0; i < commitsholder.length; i++) {
              mycommits
                .findOne({ _id: commitholder[i], is_active: false })
                .then(resultcommit => {
                  commitfullholder.push(resultcommit);
                });
            }
            if (commitfullholder == null || commitfullholder.length == 0) {
              console.log("No commits found");
              res.status(200).send({
                commitsdata: "No commits found"
              });
            }
            res.status(200).send({
              commitsdata: commitfullholder.splice(startpoint, howmany)
            });
          }
        })
        .catch(err => {
          res.status(400).send("Bad request");
        });
    }
  }
);

// API end point to route traffic of past sales
router.get("/api/pastsales/limit=:lvalue&offset=:ovalue", (req, res) => {
  var currdate = newIndDate();
  var salesholder;
  Saleslist.find({ endtime: { $lte: currdate } })
    .sort({ endtime: -1 })
    .then(result => {
      salesholder = result;
      console.log("Total pastsales found : " + result.length.toString());
    })
    .then(() => {
      var queryParams = salesholder;
      var startpoint = req.params.ovalue; // zero
      var howmany = req.params.lvalue; // ten
      res.status(200).send({
        listofpastsales: queryParams.splice(startpoint, howmany)
      });
      // return app.render(req, res,"/timesales", queryParams);
    })
    .catch(err => {
      res.status(400).send("Bad request");
    });
});

// API end point to route traffic of current sales
router.get("/api/presentsales/limit=:lvalue&offset=:ovalue", (req, res) => {
  var currdate = newIndDate();
  var salesholder;
  Saleslist.find({ endtime: { $gte: currdate }, starttime: { $lte: currdate } })
    .sort({ endtime: 1 })
    .then(result => {
      salesholder = result;
      console.log("Total presentsales found : " + result.length.toString());
    })
    .then(() => {
      var queryParams = salesholder;
      var startpoint = req.params.ovalue; // zero
      var howmany = req.params.lvalue; // ten
      res.status(200).send({
        listofpresentsales: queryParams.splice(startpoint, howmany)
      });
      // return app.render(req, res,"/timesales", queryParams);
    })
    .catch(err => {
      res.status(400).send("Bad request");
    });
});

// API end point to route traffic of future sales
router.get("/api/futuresales/limit=:lvalue&offset=:ovalue", (req, res) => {
  var currdate = newIndDate();
  var salesholder;
  Saleslist.find({ starttime: { $gte: currdate } })
    .sort({ startpoint: 1 })
    .then(result => {
      salesholder = result;
      console.log("Total futuresales found : " + result.length.toString());
    })
    .then(() => {
      var queryParams = salesholder;
      var startpoint = req.params.ovalue; // zero
      var howmany = req.params.lvalue; // ten
      res.status(200).send({
        listoffuturesales: queryParams.splice(startpoint, howmany)
      });
      // return app.render(req, res,"/timesales", queryParams);
    })
    .catch(err => {
      res.status(400).send("Bad request");
    });
});

module.exports = router;
