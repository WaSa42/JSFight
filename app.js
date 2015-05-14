var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var expressSession  = require('express-session');
var expressFlash    = require('connect-flash');
var io              = require('socket.io');
var connect         = require('connect');
var MongoStore      = require('connect-mongo')(expressSession);

var databaseConfig  = require('./config/database');
var sessionConfig   = require('./config/session');
var passportConfig  = require('./passport/init');
var jadeConfig      = require('./passport/jade');
var ioConfig        = require('./socket.io/init.js');
var routesAuth      = require('./routes/auth');
var routesApp       = require('./routes/app');
var User            = require('./models/User');

var app = express();

// database setup
mongoose.connect(databaseConfig.url, function(err) {
    if (err) {
        console.log('Unable to establish a connection to the database', err);
    } else {
        console.log('Connected to the database');
    }
});

// session store setup
var store = new MongoStore({
    mongooseConnection: mongoose.connection
});

var sessionParams = sessionConfig(store);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(sessionParams));
app.use(expressFlash());
app.use(passport.initialize());
app.use(passport.session());

// socket.io setup
app.io = io();
ioConfig(app.io, cookieParser, sessionParams);

// passport setup
passportConfig(passport);
app.use(jadeConfig);

// routes setup
app.use('/', routesAuth);
app.use('/', routesApp);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
