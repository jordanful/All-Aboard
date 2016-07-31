import Api from '../../src/api/api';
import Storage from '../../src/data/storage'
import dismissKeyboard from 'dismissKeyboard';

export default UserActions = {
  handleRouteSelection(route) {
    let newRecentlyViewedRoute = Storage.addRecentlyViewedRoute(route);
    dismissKeyboard();
    var selectedStop;
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      inputFocused: false,
      selectedStop: null,
      predictions: null, // Hide the predictions but we should show a loader
      isLoading: true,
      recentRoutes: route, // TODO perform a merge on asyncstorage instead of a set so we get all recently viewed routes
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
