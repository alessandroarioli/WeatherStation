var express = require('express');
var App = express();

App.use(express.static('public'));
App.use(express.static('public/images'));
App.use(express.static('public/images'));

/* istanbul ignore next */
if (!module.parent) {
  var port = process.env.PORT || 3000;
  App.listen(port);
  console.log('Express started on port 3000');
}
