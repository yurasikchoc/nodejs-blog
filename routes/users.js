var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

router.get('/login',function(req, res) {
  res.render('login');
});

router.post('/login',function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.authorize(username, password, function(err, user) {
    if (err) {
      return next(err);
    }
    if(user){
      req.session.user = user._id;
      res.render('index')
    } else {
      res.render('login')
    }
  });
});

router.get('/register',function(req, res) {
  res.render('register');
});

router.post('/register',function(req, res, next) {
  var username = req.body.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;
  var passwordConfirmation = req.body.passwordConfirmation;

  User.register(username, firstName, lastName, password, function(err, user){
    if (err) {
      return next(err);
    }
    if (user){
      req.session.user = user._id;
      res.render('index')    
    } else {
      res.render('register')
    }
  })
});

router.post('/logout',function(req, res, next) {
  var sid = req.session.id;

  req.session.destroy(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
