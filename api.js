var geolocation = require('/../geolocation');

var baseUrl = 'http://ctabustracker.com/bustime/api/v2';
var apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';
var urlParams = '?key=' + apiKey + '&format=json';

var api = {

  // Get list of stops, iterate through them, and return the nearest stop
  getNearestStop(route, direction, callback){
    geolocation.geolocate(function(location) { // Get user location
      var userLat = location[0];
      var userLon = location[1];
      var closestDist = 0.00000000;
      var closestId = 0;
      var url = baseUrl + '/getstops' + urlParams + '&rt=' + route.rt + '&dir=' + direction;
      console.log(url);
      return fetch(url)
        .then(function(response) {return response.json(); })
         .then(function(data) { 
          var data = data['bustime-response']
          var stopsCount = Object.keys(data.stops).length // how many stops on this line
            for (var i = 0; i < stopsCount; i++) {  
                console.log(i)
                var stopLat = data.stops[i].lat;
                console.log('the stop lat is ' + stopLat)
                var stopLon = data.stops[i].lon;
                var stopId = data.stops[i].stpid;
                var stopName = data.stops[i].stpnm;
                var dist1 = geolocation.getDistance(userLat, userLon, stopLat, stopLon, 'K');
                if (dist1 < closestDist || closestDist == 0.00000000) {
                  closestId = stopId;
                  closestDist = dist1;
                console.log('the nearest stop is ' + stopName);
                }   
            }
         });
         return callback(closestId);
    });
  },

  // Get the directions for a route, North / South or East / West
  getDirections(route, callback){
    var url = baseUrl + '/getdirections' + urlParams + "&rt=" + route.rt;
    return fetch(url)
      .then(function(response) { return response.json(); })
      .then(function(data) { 

        var defaultDir = data['bustime-response']['directions'][0]['dir']
        var date = new Date();
        var currentHour = date.getHours();
          
        if (defaultDir == "Eastbound" && currentHour < 12)  { // might need to catch East&Bound too
          callback('Eastbound')  
        } 
        else if (defaultDir == "Eastbound" && currentHour > 11) {
          callback('Westbound')
        }
        else if (defaultDir == "Northbound" && currentHour < 12) {       
          callback('Southbound') 
        }
        else if (defaultDir == "Northbound" && currentHour > 11) {       
          callback('Northbound') 
        }
      });

  },


  //  Get the minutes remaining until the next buses arrive at the stop
  //  Make sure to send the route object and the stop object? 
  //  (as opposed to the values themselves?)

  //  Remember this also returns the destination of the vehicle (new in v2 I think)

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