/* Image Upload Api*/
app.post('/upload',upload.single('image'), function(req,res){ console.log(req.file); });

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
	post.name   = req.body.name;
	post.email  = req.body.email;
	post.gender = req.body.gender;	
	post.technologies = req.body.technologies[1].toString().split(',');
	post.image  = req.file.path;

	post.save(function(error) {
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
		if(post.deletedCount <= 0){
			res.json({message: "No post found.."});
		}	
		else{
			res.json({message: "Post Deleted Successfully.."});
		}
	});
});