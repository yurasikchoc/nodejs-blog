var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: String,
  comments: [
    {      
      body:"string", 
      created: {
        type: Date,
        default: Date.now
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  ratings: [
    {      
      value: Number,
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});
schema.index({'$**': 'text'});

exports.Post = mongoose.model('Post', schema);
