var express     = require('express');
var passport    = require('passport');

var router = express.Router();
var names = ['login', 'register'];

router.get('/', function(req, res) {
    if (req.user) {
        res.redirect('/lobby');
    }

    res.render('index', {
        title: 'JSFight',
        container: 'container',
        errors: req.flash('error')
    });
});

names.forEach(function(name) {
    router.post('/' + name, passport.authenticate(name, {
        successRedirect: '/lobby',
        failureRedirect: '/',
        failureFlash: true
    }));
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
