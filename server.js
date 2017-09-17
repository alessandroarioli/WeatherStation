const imagesFolder = './public/images';
const fs = require('fs');

var express = require('express');
var App = express();

App.use(express.static('public'));
App.use(express.static('public/images'));
App.use(express.static('public/images'));


App.get('/images', function(req, res) {

  fs.readdir(imagesFolder, (err, files) => {
    var imagesArray = {rain: [], nights: [], sunny: []}

    files.forEach(file => {
      if (file.includes('rain')) {
        imagesArray.rain.push(file);
      } else if (file.includes('sun')) {
        imagesArray.sunny.push(file);
      } else if (file.includes('night')) {
        imagesArray.nights.push(file);
      }
    });
    res.send(imagesArray);
  })
});

/* istanbul ignore next */
if (!module.parent) {
  var port = process.env.PORT || 3000;
  App.listen(port);
  console.log('Express started on port 3000');
}
