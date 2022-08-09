var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ROUTER PART
var indexRouter = require('./src/routes/index');
var signinRouter = require('./src/routes/signin');
var signupRouter = require('./src/routes/signup');
var mypageRouter = require('./src/routes/mypage');
var myinfoRouter = require('./src/routes/myinfo');
var mycardRouter = require('./src/routes/card');
var orderListRouter = require('./src/routes/orderlist');
var basketRouter = require('./src/routes/basket');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// USE PART
app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/mypage', mypageRouter);
app.use('/info', myinfoRouter);
app.use('/card', mycardRouter);
app.use('/orderlist', orderListRouter);
app.use('/basket', basketRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
