var express = require('express');
var Message = require('../models/Message');
var User    = require('../models/User');
var router = express.Router();

router.get('/lobby', function(req, res, next) {
  res.render('lobby', {
      title: 'Lobby',
      container: 'container-fluid'
  });
});

router.get('/api/messages/recent', function(req, res) {
    Message
        .find()
        .sort('createdAt')
        .limit(100)
        .exec(function (err, messages) {
            res.send(messages);
        });
});

router.get('/api/users/online', function(req, res) {
    User
        .find({
            online: true
        })
        .select({
            username: 1,
            score: 1
        })
        .sort('username')
        .exec(function (err, users) {
            res.send(users);
        });
});

module.exports = router;
