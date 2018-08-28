var express = require("express");
var cors = require("cors");
var app = express();

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(express.static("./public"));

app.use(cors());

app.get("/lnglat-api", function(req, res) {
    var otherLocation = req.query.otherlocation;
     var https = require('http');
    var locationUrl= "https://maps.googleapis.com/maps/api/geocode/json?address="+otherLocation+"&key=AIzaSyDUH4BUrufRAEJU3QMZjc7W0Fnnfi-xzB4";
        
    https.get(locationUrl, function(response) {
            var body ='';
            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
              var place = JSON.parse(body);
                lat = place.results[0].geometry.location.lat;
                lon = place.results[0].geometry.location.lng;
                res.json(place.results[0].geometry);
            });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
});

app.get("/dictionary-api", function(req, res) {
    var key = "AIzaSyBUBKUo91P8Jvxy2oJDRlxv1u78YTcZAmM";
    var otherLocation = req.query.otherlocation;
    var radius;
    if(parseInt(req.query.distance) > 0){
       radius = parseInt(req.query.distance)*1609.34;
    }else{
        radius = 10 * 1609.34;
    }
    var sensor = false;
    var type = req.query.category;
    var keyword = req.query.keyword;
    var lat;
    var lon;
    var https = require('https');
    console.log("checkcategory: "+ req.query.category);
    
    if(otherLocation != ""){
        var locationUrl= "https://maps.googleapis.com/maps/api/geocode/json?address="+otherLocation+"&key=AIzaSyDUH4BUrufRAEJU3QMZjc7W0Fnnfi-xzB4";
       
        https.get(locationUrl, function(response) {
        var body ='';
        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
          var place = JSON.parse(body);
            lat = place.results[0].geometry.location.lat;
            lon = place.results[0].geometry.location.lng;
          
            var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius="+radius+"&type="+type+"&keyword="+keyword+"&key=AIzaSyBUBKUo91P8Jvxy2oJDRlxv1u78YTcZAmM";
            https.get(url, function(response) {
                var body ='';
                response.on('data', function(chunk) {
                  body += chunk;
                });
                response.on('end', function() {
                  var places = JSON.parse(body);
                  res.json(places);
                });
              }).on('error', function(e) {
                console.log("Got error: " + e.message);
              });
        });
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
    }else{
        lat = parseFloat(req.query.lat);
        lon = parseFloat(req.query.lon);
        
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius="+radius+"&type="+type+"&keyword="+keyword+"&key=AIzaSyBUBKUo91P8Jvxy2oJDRlxv1u78YTcZAmM";
        https.get(url, function(response) {
            var body ='';
            response.on('data', function(chunk) {
             body += chunk;
            });

            response.on('end', function() {
              var places = JSON.parse(body);
              console.log("on response end");
              res.json(places);
            });
          }).on('error', function(e) {
            console.log("Got error: " + e.message);
          });
    }
});

app.listen(8081);

console.log("Express app running on port 3000");

module.exports = app;
