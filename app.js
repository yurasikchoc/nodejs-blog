var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config')
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var search = require('./routes/search');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('socketio', io);

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


var sessionStore = require('./lib/sessionStore')
var session = require('express-session')({
  secret: config.get('session:secret'),
  key: config.get('session:sid'),
  cookie: config.get('session:cookie'),
  store: sessionStore
});
app.use(session);

app.use(require('./middleware/loadUser'));

app.use(flash());

app.use(function(req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/search', search);

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


http.listen(1337, function(){
  console.log('listening on *:1337');
});

io.on('connection', function(socket){
  socket.on('room', function(room) {
    socket.join(room);
  });
})