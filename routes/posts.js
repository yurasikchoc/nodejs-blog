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
		res.redirect('/');
	});
});

router.get('/:id', function(req, res, next){
	try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      return next(404);
    }  
    Post.findById(req.params.id).populate('postedBy').populate('comments.by').exec(function(err, post) {
  		if (err) return next(err); 
  		if (!post) {
  			next(404);
  		} else {
  		  res.render('posts/show', {post: post})
      }
	})
});

router.get('/:id/edit', function(req, res, next){
	try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      return next(404);
    }  
    Post.findById(req.params.id).populate('postedBy').exec(function(err, post) {
  		if (err) return next(err); 
  		if (!post) {
  			next(404);
  		} else {
  		  res.render('posts/edit', {post: post})
      }
	})
});

router.post('/:id/edit', function(req, res, next){
	try {
		var id = new ObjectID(req.params.id);
	} catch (e) {
		return next(404);
	}  
	Post.findOne({ _id: req.params.id, postedBy: req.user._id}).populate('postedBy').exec(function(err, post) {
		if (err) return next(err); 
		if (!post) {
			next(404);
		} else {
			post.body = req.body.body;
			post.title = req.body.title;
			post.imgUrl = req.body.imgUrl;
			post.save(function(err) {
				if (err)
					return next(err); 				
				else
					res.render('posts/show', {post: post});
			});
		}
	})
});

router.post('/:id/new_comment', function(req, res, next){
	try {
		var id = new ObjectID(req.params.id);
	} catch (e) {
		return next(404);
	}  
	Post.findOneAndUpdate(
	    {_id: req.params.id},
	    {$push: {comments: {body: req.body.body, by: req.user}}},
	    {safe: true, upsert: true},
	    function(err, post) {
	        if (err)
	 			return next(err); 				
			else
				res.redirect('../'+id);
	    }
	);
});

module.exports = router;
