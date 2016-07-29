import Api from '../../src/api/api';
import dismissKeyboard from 'dismissKeyboard';
export default UserActions = {
  handleRouteSelection(route) {
    dismissKeyboard();
    var selectedStop;
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      inputFocused: false,
      selectedStop: null,
      predictions: null, // Hide the predictions but we should show a loader
      isLoading: true,
    });
    Api.getDirections(route).then((directions) => {
      this.setState({
        directions: directions,
        selectedDirection: directions[0],
      },
      function() {
        UserActions.getPredictions()
      });
    })
  },

  updateDirection(direction) {
    this.setState({
      selectedStop: null,
      predictions: null,
      selectedDirection: direction,
    },
    function() {
      UserActions.getPredictions()
    });
  },

  getPredictions() {
    console.log(this.state.selectedDirection.dir, 'is the direction');
    Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (selectedStop) => {
    Api.getPredictions(this.state.selectedRoute, selectedStop).then((response) => {
        if (response.hasOwnProperty('error')) {
          console.warn(response.error[0].msg);
          console.log(response.error);
          this.setState({
            isLoading: false,
            predictions: null,
            error: response['error'][0],
            selectedStop: selectedStop,
          });
        }
        else {
          this.setState({
            isLoading: false,
            predictions: response['prd'],
            error: null,
            selectedStop: selectedStop,
          });
        }
      });
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
    let currentRecentRoutes = this.state.recentRoutes; // in case we can't set local storage
    // TODO
    // if recently viewed routes > 10 or something
    // then remove the oldest to avoid a very long list
    try {
      await AsyncStorage.mergeItem(route) // TODO we need to pass both a key and a value and a callback, not just 'route'
                                          // TODO in a callback reset recentRoutes to include this new route
                                          // I think we need to assign a UUID as a storage key, then the route object as the value
    } catch (error) {
      console.log(error);
      this.setState({
        recentRoutes: currentRecentRoutes,
      });
    }
  },

  refreshPredictions(route, direction, prediction) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      // Get the nearest stop because the user may have moved
        Api.getNearestStop(route, direction, (selectedStop) => {
        Api.getPredictions(route, selectedStop).then((response) => {
            if (response.hasOwnProperty('error')) {
              console.log('getPredictions response has an error!');
              // TODO handle error
            }
            else {
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
