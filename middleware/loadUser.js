var User = require('../models/user').User;

module.exports = function(req, res, next){
	req.user = res.locals.current_user = null;
	if (!req.session.user) return next();

	User.findById(req.session.user, function(err, user){
		if (err) return next(err);

		req.user = res.locals.current_user = user;
		next();
	});
};
