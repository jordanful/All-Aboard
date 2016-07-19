import Geolocation from '../../src/api/geolocation';

const baseUrl = 'http://ctabustracker.com/bustime/api/v2';
const apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';
const urlParams = '?key=' + apiKey + '&format=json';

export default Api = {
  // Get list of stops, iterate through them, and return the nearest stop
  getNearestStop(route, direction, callback){

    // Get user location
    Geolocation.geolocate(function(location) {
      let shortestDistance = 0.00000000;
      let nearestStop = {};
      const userLat = location.latitude;
      const userLon = location.longitude;
      const url = baseUrl + '/getstops' + urlParams + '&rt=' + route.rt + '&dir=' + direction.dir;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          var data = data['bustime-response'];
          var numberOfStops = Object.keys(data.stops).length;
            for (var i = 0; i < numberOfStops; i++) {
              let stopLat = data.stops[i].lat;
              let stopLon = data.stops[i].lon;
              let distanceFromUserToStop = Geolocation.getDistance(userLat, userLon, stopLat, stopLon, 'K');
              if (distanceFromUserToStop < shortestDistance || shortestDistance == 0.00000000) {
                shortestDistance = distanceFromUserToStop;
                nearestStop = data.stops[i];
              }
            }
            return callback(nearestStop);
         });
    });

  },

  // Get the directions for a route, either North / South or East / West
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
      .then((response) => response['bustime-response'])
      .catch((error) => {
        console.warn(error.msg);
      });
  },

  // Get all the bus routes
  getAllRoutes() {
    var url = baseUrl + '/getroutes' + urlParams;
    return fetch(url)
      .then(function(response) { return response.json(); })
  }

};
