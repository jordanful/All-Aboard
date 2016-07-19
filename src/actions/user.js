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
      })
      Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (nearestStop) => {
        this.setState({
          selectedStop: nearestStop,
        })
      UserActions.getPredictions()
      })

    })
  },

  updateDirection(direction) {
    this.setState({
      selectedDirection: direction,
      selectedStop: null,
      predictions: null,
    },
    Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (nearestStop) => {
      this.setState({
        selectedStop: nearestStop,
      })
    UserActions.getPredictions()
    })


  )},

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
