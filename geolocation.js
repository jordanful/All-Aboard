var geolocation = {
  geolocate(){
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude; 
      location = [latitude, longitude];
      // console.log(location);
      return location;
    }, function(error) {
         console.log(error);
         if (error.code === error.PERMISSION_DENIED) {
             // TODO tooltip refused
             console.log('error')
         } else {
             // TODO other error
             console.log('other error')
           }
     }
    )
  }

	// getDistance(lat1, lon1, lat2, lon2, unit) {
 //    var radlat1 = Math.PI * lat1/180
 //    var radlat2 = Math.PI * lat2/180
 //    var radlon1 = Math.PI * lon1/180
 //    var radlon2 = Math.PI * lon2/180
 //    var theta = lon1-lon2
 //    var radtheta = Math.PI * theta/180
 //    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
 //    dist = Math.acos(dist)
 //    dist = dist * 180/Math.PI
 //    dist = dist * 60 * 1.1515
 //    if (unit=="K") { dist = dist * 1.609344 }
 //    if (unit=="N") { dist = dist * 0.8684 }
 //    return dist
 //  }
}

// 'use strict';
// var React = require('react-native')
// var {

// } = React;

// var Geolocate = React.createClass({
//   watchID: (null: ?number),
//   getInitialState: function() {
//   	return {
//   		initialPosition: 'unknown',
//   		lastPosition: 'unknown'
//   	}
//   },
//   componentDidMount: function() {
//   	navigator.geolocation.getCurrentPosition(
//       (initialPosition) => this.setState({initialPosition}),
//       (error) => alert(error.message),
//       {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
//   	);
//   	this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
//       this.setState({lastPosition});
//   	});
//   },
//   componentWillUnmount: function() {
//   	navigator.geolocation.clearWatch(this.watchID);
//   }
// });


module.exports = geolocation;