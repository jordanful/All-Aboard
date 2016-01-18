var geolocation = require('/../geolocation');

var baseUrl = 'http://ctabustracker.com/bustime/api/v2';
var apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';
var urlParams = '?key=' + apiKey + '&format=json';

var api = {

  // Get list of stops, iterate through them, and return the nearest stop
  getNearestStop(route, direction, callback){
    var closestId = 0;

    geolocation.geolocate(function(location) { // Get user location
      var closestDist = 0.00000000;
      var nearestStop = {}
      var userLat = location[0];
      var userLon = location[1];
      var url = baseUrl + '/getstops' + urlParams + '&rt=' + route.rt + '&dir=' + direction.dir;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          var data = data['bustime-response'];
          var stopsCount = Object.keys(data.stops).length
            for (var i = 0; i < stopsCount; i++) {  
                var stopLat = data.stops[i].lat;
                var stopLon = data.stops[i].lon;
                var stopId = data.stops[i].stpid;
                var stopName = data.stops[i].stpnm;
                var dist1 = geolocation.getDistance(userLat, userLon, stopLat, stopLon, 'K');
                if (dist1 < closestDist || closestDist == 0.00000000) {
                  closestId = stopId;
                  closestDist = dist1;
                  nearestStop = data.stops[i]
                } 
            }
            return callback(nearestStop);
         });
    });

  },

  // Get the directions for a route, North / South or East / West
  getDirections(route){
    var url = baseUrl + '/getdirections' + urlParams + "&rt=" + route.rt;
    return fetch(url)
      .then((response) => response.json())
      .then((response) => response['bustime-response']['directions']);
  },

  // Get the minutes remaining until the next buses arrive at the stop
  // Make sure to send the route object and the stop object
  // Remember this also returns the destination of the vehicle (new in v2 I think)
  getPredictions(route, nearestStop){
    var url = baseUrl + '/getpredictions' + urlParams + '&rt=' + route.rt + '&stpid=' + nearestStop.stpid + '&top=3';
    return fetch(url)
      .then((response) => response.json())
      .then((response) => response['bustime-response']['prd']);
  },

  // Get all the bus routes

  getAllRoutes() {
    var url = baseUrl + '/getroutes' + urlParams;
    return fetch(url)
      .then(function(response) { return response.json(); })
  }

};

module.exports = api;