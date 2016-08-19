var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

router.get('/login',function(req, res) {
  res.render('users/login');
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
      res.redirect('/')
    } else {
      req.flash('error', 'Invalid login or password')
      res.redirect('login')
    }
  });
});

router.get('/register',function(req, res) {
  res.render('users/register');
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
      res.redirect('/');
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

router.get('/:id',function(req, res, next) {
  try {
      var id = new ObjectID(req.params.id);
  } catch (e) {
      return next(404);
  }
  User.findById(req.params.id).exec(function(err, post) {
      if (err) return next(err); 
      if (!post) {
        next(404);
      } else {
        res.render('users/show', {user: user})
      }
  })  
});

module.exports = router;
