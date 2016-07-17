import Api from '../../src/api/api';
import dismissKeyboard from 'dismissKeyboard';

export default UserActions = {

  handleRouteSelection(route) {
    console.log(route.rt + ' viewed!');
    dismissKeyboard();
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      inputFocused: false,
      selectedStop: null,
      predictions: null, // Hide the predictions but we should show a loader
      isLoading: true,
    });
    console.log(this.state.filterText + ' is the filter text');

    Api.getDirections(route).then((directions) => {
      this.setState({
        directions: directions,
        selectedDirection: directions[0],
      });
      this.getNearestStop();
    });
  },

  updateDirection(direction) {
    this.setState({
      selectedDirection: direction,
      selectedStop: null,
      predictions: null,
      // isLoading: true,
    },
    function() {
      this.getNearestStop();
    });
  },

  getNearestStop() {
    Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (selectedStop) => {
      this.setState({
        selectedStop: selectedStop,
      });
      this.getPredictions();
    });
  },

  getPredictions() {
    Api.getPredictions(this.state.selectedRoute, this.state.selectedStop).then((response) => {
      if (response.hasOwnProperty('error')) {
        this.setState({
          isLoading: false,
          predictions: null,
          error: response['error'][0],
        });
      }
      else {
        this.setState({
          isLoading: false,
          predictions: response['prd'],
          error: null,
        });
      }
      console.log(this.state);
    });
  },

  getRecentlyViewedRoutes() {
    Promise.all(AsyncStorage.getAllKeys()
      .then(ks =>
        ks.map(k =>
          AsyncStorage.getItem(k)
        )
      )
      .catch(err =>
         console.log(err)
      )
    )
  },

  addRecentlyViewedRoute(route) {
    // TODO
    // if recently viewed routes > 10 or something
    // then remove the oldest to avoid a very long list
    Promise.all(AsyncStorage.mergeItem(route, () =>
      getRecentlyViewedRoutes()
      .then(routes =>
        this.setState({
          recentRoutes: routes,
        })
      )
      .catch(err =>
        this.setState({
          recentRoutes: '',
        })
      )
    )
    )
  },

  refreshPredictions(route, direction, prediction) {
    return new Promise((resolve, reject) => {
      // Skipping state to just grab this from the API call down there
      // This is probably bad
      var selectedStop;

      setTimeout(() => {
      // Get the nearest stop because the user may have moved
        Api.getNearestStop(route, direction, (selectedStop) => {
          console.log(route, direction);
          console.log(selectedStop);
        Api.getPredictions(route, selectedStop).then((response) => {
            if (response.hasOwnProperty('error')) {
              console.log('getPredictions response has an error!');
              // TODO handle error

            }
            else {
              console.log('getPredictions response seems ok');
              console.log(response.prd[0].prdctdn + ' minutes until the bus arrives');
              // Should we use that listener callback?
              this.callback({ prediction: response });
            }
          });
        });
      resolve('success');
    }, 500);
    });
  },

  listenForRefreshPredictions(callback) {
    this.callback = callback;
  },
}
