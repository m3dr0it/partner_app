var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var expressFormidable = require('express-formidable');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var getDocument = require('./routes/getDocument');
var vendor = require('./routes/vendor');
var customer = require('./routes/customer');
var dashboard = require('./routes/dashboard');
var customerOld = require('./routes/customerOld');
var models = require('./models');
var session = require('express-session');
var login = require('./routes/login')
var fileStore = require('session-file-store')(session);
var passport = require('./routes/passport');
//Sync Database
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('json spaces', 2); // number of spaces for indentation
app.use(express.static(path.join(__dirname, 'public')));

// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  store : new fileStore(),
  saveUninitialized: true
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isLogin =async function(req,res,next){
  console.log(req.session.passport)
  const isLogin = await req.session.passport;
  if(isLogin){
  next()
  }else{
    res.redirect('/login')
  }
}
app.use('/',dashboard)
app.use('/customer',isLogin,customer);
app.use('/document',isLogin,getDocument);
app.use('/vendor',isLogin,vendor);
app.use('/dashboard',dashboard);
app.use('/login',login);
app.use('/logout',function(req,res,next){
  req.session.destroy();
  res.redirect('/login')
});

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