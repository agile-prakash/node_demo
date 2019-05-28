var mongoose = require('mongoose')
var schema   = mongoose.Schema

var PostSchema = new schema({
	name 		 :String,
	email		 :String,
	gender		 :String,
	image		 :String,
	technologies :[String]
});

module.exports = mongoose.model('Post', PostSchema);
