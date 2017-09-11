var express = require('express');
var App = express();

App.use(express.static('public'));

App.use('/', express.static('public/index.html'));

App.listen(8080);
