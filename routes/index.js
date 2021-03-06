const config = require("../config/config");
const jwt = require("jsonwebtoken");

const api = {};
isAuth = (req, res, next) => {
    console.log(req.xhr);
    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization,
            config.JWT_SECRET,
            (error, decoded) => {
                if (error) {
                    return next({
                        message: "Unauthenticated",
                        status: 401
                    });
                }
                req.user = {
                    _id: decoded._id,
                    email: decoded.email,
                    username: decoded.username,
                    contact: decoded.contact
                };
                next();
            }
        );
    } else {
        return next({
            message: "Unauthenticated",
            head: "Header is not present in the request.",
            status: 401
        });
    }
};

api.includeRoutes = app => {
    const unAuthRoutes = require("./unAuthRoutes");
    const userAuth = require("./user_auth_routes");
    const blogPost = require("./unAuthRoutes/blogPost");
    // const unauthproducts = require("./unAuthRoutes/products");
    const address = require("./address");
    const cart = require("./cart");
    const cupidLove = require("./cupidLove");
    const comments = require("./comments");
    const reviews = require("./reviews");
    const commits = require("./commits");
    const products = require("./products");
    const sales = require("./sales");
    const users = require("./user");
    const payments = require("./payments");
    const referral = require("./referral");

    app.use("/gp", unAuthRoutes);
    app.use("/blogposts", blogPost);
    app.use("/auth", userAuth);
    app.use("/apis/v1/*", isAuth);
    app.use("/apis/v1/addresses", address);
    app.use("/apis/v1/cart", cart);
    app.use("/apis/v1/cupidLove", cupidLove);
    app.use("/apis/v1/me", users);
    app.use("/apis/v1/comments", comments);
    app.use("/apis/v1/reviews", reviews);
    app.use("/apis/v1/commits", commits);
    app.use("/apis/v1/products", products);
    app.use("/apis/v1/referral", referral);
    app.use("/apis/v1/payments", payments);
};
module.exports = api;
