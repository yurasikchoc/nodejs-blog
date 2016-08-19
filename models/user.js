var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword =  function(password){
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password){
    this.__plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {return this.__plainPassword;});

schema.methods.checkPassword = function(password){
  return this.encryptPassword(password) == this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(null, null)
        }
      } else {
        callback(null, null)
      }
    }
  ], callback);
};


schema.statics.register = function(username, firstName, lastName, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (!user){
        var user = new User({username: username, 
            firstName: firstName, lastName: lastName, password: password});
        user.save(function(err) {
          if (err) return callback(err);
            callback(null, user);
          });
        } else {
          callback(null, null);
      }
    }
  ], callback);
};


exports.User = mongoose.model('User', schema);
