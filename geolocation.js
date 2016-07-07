export default Geolocation = {

  geolocate(callback){
    var options = {
      enableHighAccuracy: true,
      timeout: 5000
    }
    function success(pos, location) {
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      // TODO maybe return an object instead of an array
      location = [latitude, longitude];
      return callback(location);
    }
    function error(err) {
      console.warn('geolocation error: code ' + err.code + ' - ' + err.message)
      return callback(err)
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  },

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

    // TODO make sure we are returning the right type (number)
    return dist
  }
}
