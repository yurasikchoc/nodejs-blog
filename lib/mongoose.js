var mongoose = require('mongoose');
var config = require('../config')

var conf = process.env.APP_CONFIG ? JSON.parse(process.env.APP_CONFIG) : null;
var mongoPassword = 12345;
if (conf)
	var uri = "mongodb://" + conf.mongo.user + ":" + mongoPassword + "@" + conf.mongo.hostString
else
	var uri = config.get('mongoose:uri')
mongoose.connect(uri, config.get('mongoose:options'));

module.exports = mongoose