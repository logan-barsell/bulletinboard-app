//requiring npm modules
const express = require('express'),
      Sequelize = require('Sequelize'),
      fs = require('fs'),
      //initializing the router- setting express as the router
      router = express.Router();
//connecting to the bulletinboard-app database
const sequelize = new Sequelize('bulletinboard', process.env.POSTGRESS_USER, process.env.POSTGRESS_PASSWORD, {dialect: 'postgres'});

//creates table 'messages'
var message = sequelize.define('message', {
      	title: Sequelize.STRING,
      	body: Sequelize.TEXT
      });
//get request to render the index.pug file - to add a new message
router.get('/', (request, response) => {
    response.render('messages/index');
});
//gets the unique id
router.get('/:id', (request, response) => {
  message.findById(request.params.id).then((message)=> {
    response.render('messages/show', {message: message});
  });
});
router.get('/edit/:id', (request, response) => {
  message.findById(request.params.id).then((message)=> {
    response.render('messages/edit', {message: message});
    });
  });

router.post('/:id', (request, response) => {
  console.log(request.body);
  	message.update(request.body, {
      where: {
        id: request.params.id,
      }
    }).then(() => {
  		response.redirect('/messages/'+ request.params.id);
  	});
 });

 router.delete('/delete/:id', (request, response) => {
   console.log("are you listening?");
   console.log(request.body);

   	message.destroy(request.body, {
       where: {
         id: request.params.id,
       }
     }).then(() => {
   		response.redirect('/board');
   	});
  });

module.exports = router;
