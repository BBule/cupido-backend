const User = require(".././models/user");
module.exports = (req, res, next) => {
    var token = req.header("x-auth");
    User.findByToken(token)
        .then(user => {
            if (!user) {
                return next({ message: "Unauthenticated", status: 401 });
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch(function(e) {
            return next({ message: "Unauthenticated", status: 401 });
        });
};
