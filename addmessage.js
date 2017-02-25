const express = require('express'),
      fs = require('fs'),
      router = express.Router();

router.get('/', (request, response) => {
  response.render('/addmessage');
});
module.exports = router;
