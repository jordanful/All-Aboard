var baseUrl = 'http://www.ctabustracker.com/bustime/api/v1/';
var apiKey = 'PhX3QnZXw3LKKVU6jxc9CDpDC';

var api = {

 getNearestStop(rtid, rtdirection){
    var url = ``;
    return fetch(url)
      .then((response) => response.json());
  },
  getDirections(rtid){
    var url = ``;
    return fetch(url)
      .then((response) => response.json());

  },
  getDestination(){
    var url = ``;
    return fetch(url)
      .then((response) => response.json());

  },
  getPredictions(thisRoute, nearestStop){
    var url = ``;
    return fetch(url)
      .then((response) => response.json());

  },

  getAllRoutes() {
    var url = `https://dl.dropboxusercontent.com/u/119432/dummyctagetroutes.json`;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        var routes = responseData.routes,
            length = routes.length,
            dataBlob = {},
            route,
            rt,
            rtnm,
            i;
        // Iterate through each route and add to datablob
        for (i = 0; i < length; i++) {
            route = routes[i];
            rt = route.rt;
            rtnm = route.rtnm;
            dataBlob[rt + ':' + rtnm] = [rt, rtnm];            
        }
        console.log(dataBlob)
        return dataBlob;  
      }).done();
}

};

module.exports = api;