var mongoose = require('mongoose')
var schema   = mongoose.Schema

var PostSchema = new schema({
	name : String,
	email: String
});

module.exports = mongoose.model('Post', PostSchema);
