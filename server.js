var express = require('express');
var App = express();

App.use(express.static('public'));
App.use(express.static('public/images'));

App.get('/', function(req, res){
  res.render('index');
});


/* istanbul ignore next */
if (!module.parent) {
  var port = process.env.PORT || 3000;
  App.listen(port);
  console.log('Express started on port 3000');
}
