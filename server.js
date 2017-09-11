var express = require('express');
var App = express();

App.use(express.static('public'));

App.listen(8080);
