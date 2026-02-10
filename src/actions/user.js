import { Keyboard } from 'react-native';
import Api from '../api/api';
import Storage from '../data/storage';

function computeMinutes(prdt, arrT) {
  let predTime = new Date(prdt);
  let arrTime = new Date(arrT);
  let diffMs = arrTime - predTime;
  return String(Math.max(1, Math.round(diffMs / 60000)));
}

function normalizeTrainEtas(etas) {
  return etas.map(eta => ({
    prdctdn: eta.isApp === '1' ? '1' : computeMinutes(eta.prdt, eta.arrT),
    des: eta.destNm,
    stpnm: eta.staNm,
    isApp: eta.isApp,
    isDly: eta.isDly,
    isSch: eta.isSch,
  }));
}

function groupEtasByDirection(etas) {
  let groups = {};
  etas.forEach(eta => {
    let key = eta.trDr;
    if (!groups[key]) {
      groups[key] = { dir: key, label: eta.destNm, etas: [] };
    }
    groups[key].etas.push(eta);
  });
  return groups;
}

export default UserActions = {

  handleRouteSelection(route) {
    Keyboard.dismiss();
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      inputFocused: false,
      alerts: null,
      predictions: null,
      directions: null,
      selectedDirection: null,
      selectedStop: null,
      error: null,
      _trainArrivals: null,
    });

    Storage.addRecentlyViewedRoute(route).then((recentlyViewedRoutes) => {
      this.setState({
        recentRoutes: recentlyViewedRoutes,
      });
    });

    Api.getAlerts(route.rt).then((alerts) => {
      this.setState({ alerts: alerts });
    });

    if (route.type === 'train') {
      UserActions.getTrainPredictions(route);
    } else {
      Api.getDirections(route).then((directions) => {
        this.setState({
          directions: directions,
          selectedDirection: directions[0],
        },
        function() {
          UserActions.getPredictions()
        });
      });
    }
  },

  getTrainPredictions(route) {
    this.setState({
      predictions: null,
      selectedStop: null,
      isLoading: true,
    });

    Api.getNearestStation(route.rt, (station) => {
      Api.getTrainArrivals(station.mapid, route.rt, 8).then((response) => {
        if (response.errCd !== '0' || !response.eta) {
          this.setState({
            isLoading: false,
            error: { msg: 'No arrival information available' },
            selectedStop: { stpnm: station.name },
          });
          return;
        }

        let etas = Array.isArray(response.eta) ? response.eta : [response.eta];
        let groups = groupEtasByDirection(etas);
        let directions = Object.values(groups).map(g => ({
          dir: g.dir,
          label: g.label,
        }));

        let selectedDir = directions[0];
        let dirEtas = groups[selectedDir.dir].etas;
        let predictions = normalizeTrainEtas(dirEtas);

        this.setState({
          isLoading: false,
          directions: directions,
          selectedDirection: selectedDir,
          selectedStop: { stpnm: station.name },
          predictions: predictions,
          error: null,
          _trainArrivals: groups,
        });
      });
    });
  },

  updateDirection(direction) {
    let route = this.state.selectedRoute;

    if (route && route.type === 'train') {
      let groups = this.state._trainArrivals;
      let dirEtas = groups && groups[direction.dir] ? groups[direction.dir].etas : [];
      let predictions = normalizeTrainEtas(dirEtas);
      this.setState({
        selectedDirection: direction,
        predictions: predictions,
        error: predictions.length === 0 ? { msg: 'No upcoming arrivals in this direction' } : null,
      });
    } else {
      this.setState({
        selectedDirection: direction,
      },
      function() {
        UserActions.getPredictions()
      });
    }
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

  refreshPredictions(route, direction) {
    if (route && route.type === 'train') {
      return new Promise((resolve) => {
        Api.getNearestStation(route.rt, (station) => {
          Api.getTrainArrivals(station.mapid, route.rt, 8).then((response) => {
            if (!response.eta) {
              resolve();
              return;
            }
            let etas = Array.isArray(response.eta) ? response.eta : [response.eta];
            let groups = groupEtasByDirection(etas);
            let dirEtas = groups[direction.dir] ? groups[direction.dir].etas : [];
            let predictions = normalizeTrainEtas(dirEtas);

            this.setState({
              predictions: predictions,
              _trainArrivals: groups,
            });
            resolve();
          });
        });
      });
    }

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
              UserActions._refreshCallback({ prediction: response });
            }
          });
        });
      resolve('success');
    }, 500);
    });
  },

  listenForRefreshPredictions(callback) {
    UserActions._refreshCallback = callback;
  },
}
