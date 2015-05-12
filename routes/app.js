var express = require('express');
var Message = require('../models/Message');
var router = express.Router();

router.get('/lobby', function(req, res, next) {
  res.render('lobby', {
      title: 'Lobby',
      container: 'container-fluid'
  });
});

router.get('/api/messages', function(req, res) {
    Message
        .find()
        .sort('createdAt')
        .limit(100)
        .exec(function (err, users) {
            res.send(users);
        });
});

module.exports = router;
