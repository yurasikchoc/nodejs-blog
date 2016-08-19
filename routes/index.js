var express = require('express');
var router = express.Router();
var Post = require('../models/post').Post;
router.get('/', function(req, res, next) {
  Post.find({}).populate('postedBy').sort('-created').exec(function(err, posts){
  	if (err) next(err);
  	res.render('index', { posts: posts });	
  });
});

module.exports = router;
