import Api from '../../src/api/api';
import Storage from '../../src/data/storage'
import dismissKeyboard from 'dismissKeyboard';

export default UserActions = {

  handleRouteSelection(route) {
    dismissKeyboard();
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      inputFocused: false,
    });
    Storage.addRecentlyViewedRoute(route).then((recentlyViewedRoutes) => {
      this.setState({
        recentRoutes: recentlyViewedRoutes,
      });
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
      selectedDirection: direction,
    },
    function() {
      UserActions.getPredictions()
    });
  },

  getPredictions() {
    this.setState({
      predictions: null,
      selectedStop: null,
      isLoading: true,
    });
    Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (selectedStop) => {
    Api.getPredictions(this.state.selectedRoute, selectedStop).then((response) => {
        if (response.hasOwnProperty('error')) {
          this.setState({
            isLoading: false,
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
