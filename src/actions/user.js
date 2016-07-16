import Api from '../../src/api/api';

export default UserActions = {
  refreshPredictions(route, direction, prediction) {
    return new Promise((resolve, reject) => {
      console.log('refreshing prediction for... ' + route.rtnm + ' - ' + direction.dir);

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

  getAll() {
    Promise.all(AsyncStorage.getAllKeys()
      .then(ks =>
        ks.map(k =>
          AsyncStorage.getItem(k)
        )
      )
    )
  },

  viewRoute(route) {
    console.log(route.rtnm + ' viewed!');
    // AsyncStorage.mergeItem(route, () =>
    // AsyncStorage.getAll()
    //   .then(routes =>
    //     this.setState({
    //       recentRoutes: routes,
    //     })
    //   )
    //   .catch(err =>
    //     this.setState({
    //       recentRoutes: '',
    //     })
    //   );
    // );
  },

}
