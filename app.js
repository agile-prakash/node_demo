const dbConfig   = require('./config/database.config.js');
const mongoose   = require('mongoose');
const express    = require('express');
const bodyParser = require('body-parser');
const app 		 = express();
const port 		 = 3000

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
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

/* Get All Posts */
app.get('/posts', function(req,res){
	Post.find(function(error, posts){
		if(error)
			res.send(error);

		res.json(posts)
	});
});

/* Create New Post */
app.post('/posts',function(req,res){
	// console.log(req.body)
	var post   = new Post();
	post.name  = req.body.name
	post.email = req.body.email

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