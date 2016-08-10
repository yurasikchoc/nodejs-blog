var express = require('express');
var Post = require('../models/post').Post;
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

router.get('/new',function(req, res) {
  res.render('posts/new');
});

router.post('/new',function(req, res, next) {
	var title = req.body.title;	
	var body = req.body.body;
	var imgUrl = req.body.imgUrl;
	var post = new Post({
		title: title,
		body: body,
		imgUrl: imgUrl,
		postedBy: req.user
	});
	post.save(function(err){
		if (err) next(err);
		res.render('index')
	});
});

router.get('/:id', function(req, res, next){
	try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      return next(404);
    }  
    Post.findById(req.params.id, function(err, post) {
  		if (err) return next(err); 
  		if (!post) {
  			next(404);
  		} else {
  		  res.json(post)
      }
	})
});


module.exports = router;
