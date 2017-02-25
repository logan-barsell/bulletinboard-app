//declare npm packages
const express = require('express'),
 	  morgan = require('morgan'),
 	  bodyParser = require('body-parser'),
 	  methodOverride = require('method-override'),
 	  Sequelize = require('Sequelize'),
 	  pug = require('pug');
//declaring that we are using express
var app = express(),
//connecting to the 'bulletinboard-app' database
	sequelize = new Sequelize('bulletinboard', process.env.POSTGRESS_USER, process.env.POSTGRESS_PASSWORD, {dialect: 'postgres'});
//requiring route messages.js in 'routes' folder
var messagesRouter = require('./routes/messages');
//creates table 'messages'
var message = sequelize.define('message', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});
// use morgan middleware to print HTTP requests to help with debugging
app.use(morgan('dev'));
//setting the view engine as pug
app.set('view engine', 'pug');
// to parse a text input from a user we need bodyParser
app.use(bodyParser.urlencoded({extended: false}));
//use notices router
app.use('/messages', messagesRouter);

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

//get request to redirect the 'homepage' to the messages route
//1. Go to route notices.js, go to the app.get('/') in the messages.js file
app.get('/', (request, response)=>{
  response.redirect('/messages');
});
//get request to /board route
app.get('/board', (request, response)=> {
  //findALL - native method in sequelize, findAll re
  //everything in the message table
  //'notices' is passed as a parameter
  message.findAll().then((messages) => {
    //renders the board.pug file, in the messages folder
    //notices object is passed as a parameter
      response.render('messages/board', {messages: messages});
  });
});

//insert a new entry into the messages table
 app.post('/new-message', (request, response) => {
   //takes everything in request.body, from name attribute in pug file
 	message.create(request.body).then(() => {
    //redirects to url[home]/board, goes to board get request
 		response.redirect('/board');
 	});
});




sequelize.sync().then(() =>{
  console.log('connected to database');
app.listen(3000, ()=> {
  console.log('connected to server');
});
});
