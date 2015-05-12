var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/User');
var bcrypt          = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('register', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            process.nextTick(function() {
                User.findOne({
                        username: username
                    },
                    function(err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            return done(null, false, 'Username already used');
                        }

                        var newUser = new User({
                            username: username,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                        });

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                );
            });
        })
    );
};
