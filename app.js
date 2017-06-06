const express = require('express')
// npm install express --save

const app = express()

const Sequelize = require('sequelize')
const db = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost/blog_app`)
//create a new datbase and modify the connection link
// npm install sequelize --save
// npm install pg --save (it's needed to use sequelize)

const pug = require('pug')
// npm install pug --save

const bodyParser = require('body-parser')
//npm install body-parser --save

app.use('/', bodyParser())

// app.set
app.set('views', 'src/views');
app.set('view engine', 'pug');
                                                   /* Posts */

/* Creating the database */

// Create table posts
var Post = db.define( 'post', {
	post: Sequelize.STRING
})

// Create table user
var User = db.define( 'user',{
	name: Sequelize.STRING
})

// Create table comment
var Comment = db.define( 'comment', {
	comment: Sequelize.STRING
})

// connect the tables together
User.hasMany(Post)
User.hasMany(Comment)
Post.belongsTo(User)
Comment.belongsTo(User)
Post.hasMany(Comment)

db.sync() // ({force:true} if the tables doesn't exist create it and overwrite them everytime the app has been run**

app.get('/createPost', (req,res) => { // Get the pug file and transform it to HTML and display it
	res.render('CreatePost')
})

app.post('/createPost', (req,res) => { // deal with the data that the client has sent and send a response
	Posts.create({ // add the post to the database
		post : req.body.post
	})
	res.send('done')
})

app.get('/viewPost', (req,res) =>{ // Get the pug file and and pass to it the array of posts and then transform the pug file to HTML and display it
	Post.findAll()
	.then((loopInPost) =>{
		const arrayOfPosts = []
		for(var i = 0; i < loopInPost.length; i++) {
			arrayOfPosts.push(loopInPost[i].dataValues)
			console.log('loopInPost[i].dataValues' + loopInPost[i].dataValues)
		}
		console.log("arrayOfPosts" + arrayOfPosts)
		res.render('viewPost', {results: arrayOfPosts})
	})
})

var listener = app.listen(3001, function () {
	console.log('The server is listening on port ' + listener.address().port);
});




