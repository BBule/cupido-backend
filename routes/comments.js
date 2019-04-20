const express = require("express");
const router = express.Router();
// Helper Functions
function newIndDate() {
    var nDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta"
    });
    return nDate;
}

// Models
const User = require("../models/user");

const mycomments = require("../models/mycomments");

const myreplies = require("../models/myreplies");
// POST Route to send comment entry of an individual to the admin discretion portal
// Create a new object and then embed data into the array
// User can send this route
router.post("/:productid", (req, res, next) => {
    console.log("Posting comment to the admin discretion portal");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    let checkbuy = false;
    // Will be true if myorders in user will be found.
    User.findOne({ _id: curruser._id }).then(result => {
        var found = result.myorders.some(function(el) {
            return el.Product.id === req.params.productid;
        });
        if (found) {
            checkbuy = true;
        }
    });
    let newcomment = new mycomments({
        "User.id": curruser._id,
        "Product.id": req.params.productid,
        "Product.name": req.body.productname,
        "Product.rating": req.body.productrating,
        timecreated: newIndDate(),
        is_review: true,
        is_published: false,
        commentbody: req.body.commentbody,
        is_verified_buyer: checkbuy
    });
    newcomment
        .save()
        .then(() => res.send({ message: "Comment sent for review" }))
        .catch(err => {
            return next({ message: "Bad request", status: 400, stack: err });
        });
});

router.get("/:productid", async (req, res, next) => {
    let curruser = req.user;
    try {
        var comments = await mycomments
            .find({
                "Product.id": req.params.productid
            })
            .populate("User.id", "username")
            .exec();
        comments = comments.map(async function(comment) {
            if (comment.upvotes.meta.indexOf(curruser._id) >= 0) {
                comment.user_upvoted = true;
                comment.down_upvoted = false;
            } else if (comment.downvotes.meta.indexOf(curruser._id) >= 0) {
                comment.user_upvoted = false;
                comment.down_upvoted = true;
            } else {
                comment.user_upvoted = false;
                comment.down_upvoted = false;
            }
            return comment;
        });

        return res.send(comments);
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

router.post("/upvote", async function(req, res,next) {
    let curruser = req.user;
    try {
        var commentUpvoted = await mycomments.findOne({
            _id: req.body.commentid,
            "upvotes.meta": curruser._id
        });
        var commentDownvoted = await mycomments.findOne({
            _id: req.body.commentid,
            "downvotes.meta": curruser._id
        });
        if (commentUpvoted) {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $pull: { "upvotes.meta": curruser._id },
                    $inc: { "upvotes.count": -1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: false,
                user_downvoted: false
            });
        } else if (commentDownvoted) {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $pull: { "downvotes.meta": curruser._id },
                    $push: { "upvotes.meta": curruser._id },
                    $inc: { "upvotes.count": 1, "downvotes.count": -1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: true,
                user_downvoted: false
            });
        } else {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $push: { "upvotes.meta": curruser._id },
                    $inc: { "upvotes.count": 1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: true,
                user_downvoted: false
            });
        }
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

router.post("/downvote", async function(req, res, next) {
    let curruser = req.user;
    try {
        var commentUpvoted = await mycomments.findOne({
            _id: req.body.commentid,
            "upvotes.meta": curruser._id
        });
        var commentDownvoted = await mycomments.findOne({
            _id: req.body.commentid,
            "downvotes.meta": curruser._id
        });
        if (commentDownvoted) {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $pull: { "downvotes.meta": curruser._id },
                    $inc: { "downvotes.count": -1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: false,
                user_downvoted: false
            });
        } else if (commentUpvoted) {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $pull: { "upvotes.meta": curruser._id },
                    $push: { "downvotes.meta": curruser._id },
                    $inc: { "downvotes.count": 1, "upvotes.count": -1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: false,
                user_downvoted: true
            });
        } else {
            var comment = await mycomments.findOneAndUpdate(
                { _id: req.body.commentid },
                {
                    $push: { "downvotes.meta": curruser._id },
                    $inc: { "downvotes.count": 1 }
                },
                { new: true }
            );
            res.send({
                upvotes: comment.upvotes.count,
                downvotes: comment.downvotes.count,
                user_upvoted: false,
                user_downvoted: true
            });
        }
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

router.post("/reply/:commentid", async (req, res, next) => {
    console.log("Posting reply to the admin discretion portal");
    let curruser = req.user;
    // All properties to be input from user
    // Nothing except ID of user from tech logics.
    try {
        let comment = await mycomments.findOne({ _id: req.params.commentid });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        let checkbuy = false;
        // Will be true if myorders in user will be found.
        User.findOne({ _id: curruser._id }).then(result => {
            var found = result.myorders.some(function(el) {
                return el.Product.id === req.params.productid;
            });
            if (found) {
                checkbuy = true;
            }
        });

        let newreply = new myreplies({
            "User.id": curruser._id,
            "Comment.id": req.params.commentid,
            timecreated: newIndDate(),
            is_review: true,
            is_published: false,
            replybody: req.body.replybody,
            is_verified_buyer: checkbuy
        });

        await newreply.save();

        return res.send({ message: "Reply sent for review" });
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

router.get("/reply/:commentid", async (req, res) => {
    try {
        var replies = await myreplies
            .find({
                "Comment.id": req.params.commentid
            })
            .populate("User.id", "username")
            .exec();
        return res.send(replies);
    } catch (error) {
        return next({
            message: error.message || "Unknown error",
            status: 400,
            stack: error
        });
    }
});

module.exports = router;
