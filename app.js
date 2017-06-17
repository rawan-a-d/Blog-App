										/* require libraries */
const express = require('express')

const app = express()

const Sequelize = require('sequelize')
const db = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost/blog_app`)

const bodyParser = require('body-parser')

const session = require('express-session')

const bcrypt = require('bcrypt');

// app.set
app.set('views', __dirname + '/src/views');
app.set('view engine', 'pug');

app.use('/', bodyParser());
app.use(express.static('src/public'));
app.use(session({
	secret: process.env.Session_secret,
	resave: true,
	saveUninitialized: false
}));
                                                


												/* Creating the database */

// Create table posts
var Post = db.define( 'post', {
	content: {type: Sequelize.STRING, allowNull: false}
});

// Create table user
var User = db.define( 'user',{
	name: {type: Sequelize.STRING, allowNull: false},
	email: {type: Sequelize.STRING, allowNull: false, unique: true},
	password: {type: Sequelize.STRING, allowNull: false}
});

// Create table comment
var Comment = db.define( 'comment', {
	name: {type: Sequelize.STRING, allowNull: false}
});

// connect the tables together
User.hasMany(Post);
User.hasMany(Comment);
Post.belongsTo(User);
Comment.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);

db.sync(); // ({force:true} if the tables doesn't exist create it and overwrite them everytime the app has been run**


                                                /* Register */

app.get('/register', (req,res) =>{ // Get the pug file and transform it to HTML and display it
	res.render('register')
});

app.post('/register', (req,res) =>{ // deal with the data that the client has sent and send a response
	User.findOne({ //look if a user already has an account
		where: {
			email: req.body.email
		}
	})
	.then((user) =>{
		if(user) { // if so show this message
			res.send('This email already exists'); //*** //use ajax
		}
		else if(req.body.password === req.body.password_conf && req.body.password.length !== 0 && req.body.password_conf.length !== 0){ //otherwise create an account
			bcrypt.hash(req.body.password, 9, (err, hash) =>{// store 'hash' into your database
				if(err){
					console.log(err);
				}
				else{
					User.create({
						name: req.body.name,
						email: req.body.email,
						password: hash
					})
					.then((user)=>{
						res.render('logIn',{message: 'Welcome '+ user.name });
					})
					.catch((err) =>{
						throw err;
					});
				}
			});
		}
	})
	.catch((err) =>{
		throw err;
	});
});


													/* Validation */

app.post('/validation', function(req,res){ // deal with an ajax request and send a response
	User.findOne({ //look if a user already has an account
		where: {
			email: req.body.typedIn
		}
	})
	.then((user) =>{
		var message = '';
		if(user){ // if so send this message
			message = 'This email already exists';
			res.send(message);
		}
		else{ // otherwise do this
			message = '';
			res.send(message);
		}
	})
	.catch((err) =>{
		throw err;
	});	
});

                                                   /* Log in */

app.get('/logIn', (req,res) =>{
	res.render('LogIn');
});

app.post('/logIn', (req,res) =>{
	if(req.body.email.length === 0 || req.body.password.length === 0) {
		res.render('logIn' , {message: "Please fill in your email address and your password"});
		return;
	}

	User.findOne({ //look if the user's information matches the ones in the database
		where: {
			email: req.body.email
		}
	})
	.then((user) =>{
		if(user !== null){ // if user exists in the db
			var hash = user.password;
			bcrypt.compare(req.body.password, hash, (err, result) =>{// result === true
				console.log('reached');
				if(result === true){ // if the password is correct
					req.session.user = user; // start a session
					res.redirect('/profile'); // and redirect to the profile page
				}
				else{ // otherwise do this
					res.render('logIn', {message:'Invalid email or password'});

				}
			});
		}
		else{
			res.render('logIn', {message: "You don't have an account."});
		}
	})
	.catch((err) =>{
		throw err;
	});
});

													/* Profile */

app.get('/profile', (req,res) =>{
	var user = req.session.user;
	if(user === undefined){
		res.render('logIn',{message: "Please log In to view your profile"});
	}
	else{
		Post.findAll({
			where : {
				userId : req.session.user.id
			}, order: '"updatedAt" DESC' , include: [User, {model: Comment, include: [User]}]
		})
		.then((posts) =>{
			res.render('profile', {FullName: user.name, results: posts});
		})
		.catch((err) =>{
			throw err;
		});
	}
});


                                                   /* Profile page */


app.post('/profile', (req,res) => { // deal with the data that the client has sent and send a response
	console.log('req.body',req.body)
	console.log('req.session', req.session)
	Post.create({ // add the post to the database
		content : req.body.typedIn,
		userId : req.session.user.id
	})
	.then( (text) => {
			res.send(text.content)
	})
	.catch((err) =>{
		console.log(err)
	})
});

									/* Posts */													
app.get('/viewPost', (req,res) =>{ // Get the pug file and and pass to it the array of posts and then transform the pug file to HTML and display it
	var user = req.session.user;
	if(user === undefined){
		res.render('logIn',{message: "Please log In to view your profile"})
	}
	else{
		Post.findAll({
			include: [User, {model: Comment, include: [User]}]	
		})
		.then((posts) =>{
			res.render('viewPost', {results: posts});
		})
		.catch((err) =>{
			throw err;
		});
	}
});

									/* Comments */
app.post('/comments', (req,res) =>{
	Comment.create({ // add the comment to the database
		name : req.body.comment,
		userId : req.session.user.id,
		postId : req.body.postId
	})
	.then( (text) => {
		res.redirect('/viewPost')
	})
	.catch((err) =>{
		console.log(err)
	})

})

									/* Log out */
app.get('/logOut', (req,res) =>{
	req.session.destroy((err) =>{ // destroy the session
		if(err){
			throw err
		}
		res.render('logIn',{message: 'Successfully logged out.'})
	})
})

									/* The server */
var listener = app.listen(8080, function () {
	console.log('The server is listening on port ' + listener.address().port);
});
