module.exports = function (req, res, next) {
    if (req.user) {
        res.locals.currentUser = {
            username: req.user.username
        };
    }

    next();
};
