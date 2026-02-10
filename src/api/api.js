import Geolocation from './geolocation';
import { STATIONS } from '../data/stations';

const baseUrl = 'https://ctabustracker.com/bustime/api/v2';
const apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';
const urlParams = '?key=' + apiKey + '&format=json';

const trainBaseUrl = 'https://lapi.transitchicago.com/api/1.0';
const trainApiKey = '71a3a034ae7949e3bb14eadb996a902a';

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (e) {
        reject(e);
      }
    };
    xhr.onerror = () => reject(new Error('Network request failed'));
    xhr.send();
  });
}

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
      getJSON(url)
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
    return getJSON(url)
      .then((response) => response['bustime-response']['directions']);
  },

  // Get the minutes remaining until the next buses arrive at the stop
  // Make sure to send the route object and the stop object
  // Remember this also returns the destination of the vehicle (new in v2 I think)
  getPredictions(route, nearestStop){
    var url = baseUrl + '/getpredictions' + urlParams + '&rt=' + route.rt + '&stpid=' + nearestStop.stpid + '&top=3';
    return getJSON(url)
      .then((response) => response['bustime-response'])
      .catch((error) => {
        console.warn(error.msg);
      });
  },

  // Get all the bus routes
  getAllRoutes() {
    var url = baseUrl + '/getroutes' + urlParams;
    return getJSON(url);
  },

  // Find the nearest L station for a given train line
  getNearestStation(lineCode, callback) {
    Geolocation.geolocate(function(location) {
      const userLat = location.latitude;
      const userLon = location.longitude;
      const lineStations = STATIONS.filter(s => s.lines.indexOf(lineCode) !== -1);
      let shortestDistance = 0;
      let nearestStation = lineStations[0];
      for (let i = 0; i < lineStations.length; i++) {
        let dist = Geolocation.getDistance(userLat, userLon, lineStations[i].lat, lineStations[i].lon, 'K');
        if (dist < shortestDistance || shortestDistance === 0) {
          shortestDistance = dist;
          nearestStation = lineStations[i];
        }
      }
      callback(nearestStation);
    });
  },

  // Get train arrival predictions for a station
  getTrainArrivals(mapid, rt, max) {
    var url = trainBaseUrl + '/ttarrivals.aspx?key=' + trainApiKey
      + '&mapid=' + mapid + '&rt=' + rt + '&max=' + (max || 8) + '&outputType=JSON';
    return getJSON(url)
      .then((response) => response['ctatt'])
      .catch((error) => {
        console.warn('Failed to load train arrivals:', error);
        return { eta: [] };
      });
  },

  // Get customer alerts for a route from the CTA Alerts API
  getAlerts(routeId) {
    var url = 'https://www.transitchicago.com/api/1.0/alerts.aspx?outputType=JSON&routeid=' + routeId;
    return getJSON(url)
      .then((response) => {
        let alerts = response['CTAAlerts']['Alert'];
        if (!alerts) return [];
        // Normalize: API returns single object when 1 alert, array when multiple
        return Array.isArray(alerts) ? alerts : [alerts];
      })
      .catch((error) => {
        console.warn('Failed to load alerts:', error);
        return [];
      });
  }

};
