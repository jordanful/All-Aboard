var geolocation = require('/../geolocation');

var baseUrl = 'http://ctabustracker.com/bustime/api/v2';
var apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';
var urlParams = '?key=' + apiKey + '&format=json';

var api = {

  // Determines distance between two points (ie user and bus stop)
  getDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  },

   // Grabs the user's location, fucked up now because I don't understand asyncronous development
  getUserLocation() {
    var location = geolocation.geolocate(); // this is async so needs a callback
    return location
  },

  // Get list of stops, iterate through them, and return the nearest stop
  getNearestStop(route, direction, callback){
    var closestDist = 0.00000000;
    var closestId = 0;
    var url = baseUrl + '/getstops' + urlParams + '&rt=' + route.rt + '&dir=' + direction;
    return fetch(url)
      .then(function(response) { return response.json(); })
       .then(function(data) { 
        // for each value in data object, do this stuff
         for (var stop in data) {
           if (data.hasOwnProperty(stop)) {
             var stopLat = data['bustime-response'].stop.lat;
             var stopLon = data['bustime-response'].stop.lon;
             var stopId = data['bustime-response'].stop.stpid;
             var stopName = data['bustime-response'].stop.stpnm;
             var dist1 = getDistance(userLat, userLon, stopLat, stopLon, 'K');
             if (dist1 < closestDist || closestDist == 0.00000000) {
               closestId = stopId;
               closestDist = dist1;
             console.log('the nearest stop is ' + stopName);
             }
           }
         }
       });
       callback(closestId);
  },

  // Get the directions for a route, North / South or East / West
  getDirections(route){
    var url = baseUrl + '/getdirections' + urlParams + "&rt=" + route.rt;
    return fetch(url)
      .then(function(response) { return response.json(); })
  },


  //  Get the minutes remaining until the next buses arrive at the stop
  //  Make sure to send the route object and the stop object? 
  //  (as opposed to the values themselves?)

  //  Remember this also returns the destination of the vehicle (new in v2)

  getPredictions(thisRoute, nearestStop){
    var url = baseUrl + '/getPredictions' + urlParams + '&rt=' + route.rt + '&stpid=' + nearestStop.stpid;
    return fetch(url)
      .then((response) => response.json());
  },

  // Get all the bus routes

  getAllRoutes() {
    var url = baseUrl + '/getroutes' + urlParams;
    return fetch(url)
      .then(function(response) { return response.json(); })
  }

};

module.exports = api;