const dbConfig   = require('./config/database.config.js');
const mongoose   = require('mongoose');
const express    = require('express');
const bodyParser = require('body-parser');
var multer  	 = require('multer')
const app 		 = express();
const port 		 = 3000
var path 		 = require('path')

var storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./public/assets')
	},
	filename: function(req,file,cb){		
		cb(null, Date.now()+'_'+file.originalname);		
	}
});

var upload  = multer( {storage : storage} )

app.use('/public', express.static(path.resolve('./public')));

var Post = require('./app/model/post.js');

mongoose.Promise  = global.Promise; 

mongoose.connect(dbConfig.url,{	
	useNewUrlParser: true
}).then(() => {
	console.log("Connected...");
}).catch(error => {
	console.log("Error", error);
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/* Image Upload Api*/
app.post('/upload',upload.single('image'), function(req,res){
	console.log(req.file);
});

app.get('/assets', function(req,res){

});

/* Get All Posts */
app.get('/posts', function(req,res){
	Post.find().sort({'_id': -1 }).exec(function(error, posts){
		if(error)
			res.send(error);

		res.json({posts:posts})
	});
});

/* Create New Post */
app.post('/posts',upload.single('image'), function(req,res){
	var post    = new Post();
	post.name   = req.body.name
	post.email  = req.body.email
	post.gender = req.body.gender	
	post.technologies = req.body.technologies
	post.image  = req.file.path

	post.save(function(error){
		if(error)
			res.send(error)

		res.json({message: "New Post Created..."})
	});
});

/* Show Single Post */
app.get('/posts/:post_id', function(req, res){
	Post.findById(req.params.post_id, function(error, post){
		if(error)
			res.send(error);

		res.json(post);
	});
});

/* Update Post */
app.put('/posts/:post_id', function(req,res){
	Post.findById(req.params.post_id, function(error, post){
		if(error)
			res.send(error)

		post.name  = req.body.name;
		post.email = req.body.email;

		post.save(function(error){
			if(error)
				res.send(error)

			res.json(post)
		});

	});
});

/* Delete Post */
app.delete('/posts/:post_id', function(req,res){
	Post.remove({
		_id: req.params.post_id
	},function(error, post){
		console.log(post);
		if(post.deletedCount <= 0){
			res.json({message: "No post found.."});
		}	
		else{
			res.json({message: "Post Deleted Successfully.."});
		}
	});
});

app.listen(port, ()=> console.log("Port 3000 running ....") )