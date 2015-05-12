var express = require('express');
var router = express.Router();

router.get('/lobby', function(req, res, next) {
  res.render('lobby', {
      title: 'Lobby',
      container: 'container-fluid'
  });
});

module.exports = router;
