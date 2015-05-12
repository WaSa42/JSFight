var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../../models/User');
var bcrypt          = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne({
                    username: username
                },
                function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, false, 'User not found');
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, 'Invalid password');
                    }

                    return done(null, user);
                }
            );
        }
    ));
};
