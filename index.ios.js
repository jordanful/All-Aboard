'use strict';

var _ = require('lodash');
var React = require('react-native');
var SideMenu = require('react-native-side-menu');
var api = require('/../api');


var {
  ActivityIndicatorIOS,
  AppRegistry,
  AppStateIOS,
  AsyncStorage,
  Image,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  StatusBarIOS,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} = React;


var Menu = React.createClass({
  componentDidMount: function() {
    this.getAllRoutes(),
    AppStateIOS.addEventListener('change', this.handleAppStateChange);

    AsyncStorage.getItem("recentRoutes").then((value) => {
      this.setState({recentRoutes: value});
    }).done();
  },

  componentWillUnmount: function() {
    AppStateIOS.removeEventListener('change', this.handleAppStateChange);
  },

  handleAppStateChange: function(state) {
    if (!this.state.loaded) {
      this.getAllRoutes()
    }
  },

  getInitialState: function() {
    return {
      selectedRoute: null,
      prediction: null,
      userLocation: '',
      allRoutes: [],
      routeDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      filterText: '',
      // recentRoutes:
    }
  },

  getAllRoutes: function() {
    api.getAllRoutes()
      .then((responseData) => responseData['bustime-response']['routes'])
      .then((routes) => this.setState({
        allRoutes: routes,
      }));
  },

  render: function() {
    let { allRoutes, filterText } = this.state;

    let filteredRoutes = filterText.length > 0
      ? this._filterRoutes(allRoutes, filterText)
      : allRoutes;

    return (
      <View style={styles.menuContainer}>
        <SearchBar onChange={this._onChange} />
        <ListView
          // renderHeader={{
          //   // <RecentlyViewedRoutes routes={this.props.recentlyViewedRoutes} />
          // }}
          dataSource={this.state.routeDataSource.cloneWithRows(filteredRoutes)}
          renderRow={this.renderRoute}
        />
      </View>
    );
  },

  _onChange: function(text) {
    this.setState({
      filterText: text,
    });
  },

  _filterRoutes: function(routes, filterText) {
    return _.filter(routes, (route) => {
      let filterTextLowercase = filterText.toLowerCase();
      let routeNameLowercase = route.rtnm.toLowerCase();

      if (route.rt.indexOf(filterTextLowercase) > -1) {
        return true;
      }

      if (routeNameLowercase.indexOf(filterTextLowercase) > -1) {
        return true;
      }

      return false;
    });
  },

  renderRoute: function(route) {
    return (
      <TouchableHighlight
        onPress={() => this.props.onSelect(route) && UserActions.viewRoute(route)}
        underlayColor='#0D1F42'
        >
        <View style={styles.row}>
          <View style={styles.menuRouteNumberContainer}>
            <Text style={styles.menuRouteNumber}>
              {route.rt}
            </Text>
          </View>
          <Text style={styles.menuRouteName}>
            {route.rtnm}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

});



var SearchBar = React.createClass({
  render: function() {
    let { onChange } = this.props;

    return (
      <TextInput
        ref='searchInput'
        style={styles.menuSearch}
        autoCapitalize='words'
        autoCorrect={false}
        clearButtonMode='while-editing'
        placeholder='Search for a route'
        placeholderTextColor='#BABABA'
        clearTextOnFocus ={true}
        returnKeyType='go'
        onChangeText={onChange} />
    );
  }
});
// var RecentlyViewedRoutes = React.createClass({
//   render: function() {
//     return (
//       <Text>
//         66
//       </Text>
//       <Text>
//         56
//       </Text>
//       <Text>
//         12-B
//       </Text>
//     );
//   }
// });
var Directions = React.createClass({
  render: function() {
    var directions = this.props.directions || [];

    return (
      <View style={styles.directions}>
        { directions.map((direction, i) =>
          <TouchableOpacity key={i} style={styles.direction} onPress={() => this.props.onChooseDirection(direction)}>
            <Text style={direction.dir == this.props.selectedDirection.dir ? styles.directionTextActive : styles.directionText}>
              {this._prettyName(direction.dir)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },

  _prettyName: function(fullDirectionName) {
    var DIRECTION_NAME_MAP = {
      "Northbound" : "North",
      "Southbound" : "South",
      "Eastbound"  : "East",
      "Westbound"  : "West",
      "North Bound" : "North",
      "South Bound" : "South",
      "East Bound"  : "East",
      "West Bound"  : "West",
    };

    return DIRECTION_NAME_MAP[fullDirectionName];
  }
});

var ContentViewHeader = React.createClass({
  render: function() {
    var activeRoute = this.props.activeRoute || { rtnm: "Choose Route", rt: "" };

    return (
      <View style={styles.contentViewHeader}>
        <Button onPress={this.props.onLeftButtonPress} />
        <View style={styles.contentViewHeaderRouteNumberAndNameContainer}>
          <View style={activeRoute.rt && styles.contentViewHeaderRouteNumberContainer}>
            <Text style={styles.contentViewHeaderRouteNumber}>
              {activeRoute.rt}
            </Text>
          </View>
          <Text style={styles.contentViewHeaderRouteName}>
            {activeRoute.rtnm}
          </Text>
        </View>
        <View style={styles.contentViewHeaderDummyRightSpace}></View>
      </View>
    );
  }
});

class Button extends React.Component  {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image style={styles.contentViewHeaderIcon} source={require('./assets/images/contentViewHeaderIcon.png')} />
      </TouchableOpacity>
    );
  }
}


var Minutes = React.createClass({
  render: function() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    return (
      <View>
        <Text style={styles.minutes}>{prediction.prdctdn}</Text>
        <Text style={styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
});

var Stop = React.createClass({
  render: function() {
    var stop = this.props.stop;
    if (!stop) { return null; }

    return (
      <Text style={styles.stop}>{stop.stpnm}</Text>
    );
  }
});

var Destination = React.createClass({
  render: function() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null; }

    return(
      <Text style={styles.destination}>To {prediction.des}</Text>
    );
  }
});

var NextPrediction = React.createClass({
  render: function() {

    var prediction = this.props.prediction;
    if (!prediction) { return null };

    return(
      <Text style={styles.nextPrediction}>{prediction.prdctdn} minutes</Text>
    );
  }
});

var Error = React.createClass({

  render: function() {
    let { error } = this.props;

    return (
      <Text style={styles.nextPrediction}>
        {error.msg}
      </Text>
    )
  }
});

var ContentView = React.createClass({
  getInitialState: function() {
    return {
        predictions: this.props.predictions,
        isRefreshing: false,
      }
  },

  render: function() {
    let { activeRoute, error } = this.props;

    return (
      <View style={styles.contentView}>
        <ContentViewHeader activeRoute={activeRoute} onLeftButtonPress={this.props.onLeftButtonPress} />
          <ScrollView
            style={styles.container}
            activeRoute={activeRoute}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="#FFF"
                title=""
              />
            }
          >
            <Directions directions={this.props.directions} selectedDirection={this.props.selectedDirection} onChooseDirection={this.props.onChooseDirection} />
            {error &&
              <Error error={error} />
            }

            {!error &&
              <View>
                <Minutes predictions={this.props.predictions} />
                <Stop stop={this.props.selectedStop} />
                <Destination predictions={this.props.predictions} />
                <NextPrediction prediction={this.props.predictions && this.props.predictions[1]} />
                <NextPrediction prediction={this.props.predictions && this.props.predictions[2]} />
              </View>
            }
          </ScrollView>
      </View>

      );
  },

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });

    UserActions.refreshPredictions(this.props.activeRoute, this.props.selectedDirection)
      .then(() => {
        this.setState({
          isRefreshing: false,
        });
      })
      .catch(() => {
        alert("Oops! Please try again.");

        this.setState({
          isRefreshing: false,
        });
      });

  }
});

var AllAboardReact = React.createClass({

  render: function() {
    var menu = (
      <Menu activeRoute={this.state.selectedRoute} onSelect={this.handleRouteSelection} />
    );

    return (
      <SideMenu
        animation='spring'
        touchToClose={true}
        openMenuOffset={deviceWidth * 0.86}
        isOpen={this.state.isMenuOpen}
        menu={menu}
        >
        <ContentView
          onLeftButtonPress={this.openMenu}
          onChooseDirection={this.updateDirection}
          activeRoute={this.state.selectedRoute}
          directions={this.state.directions}
          selectedDirection={this.state.selectedDirection}
          selectedStop={this.state.selectedStop}
          predictions={this.state.predictions}
          error={this.state.error}
          />
      </SideMenu>
    );
  },

  componentDidMount() {
    UserActions.listenForRefreshPredictions(((predictions) => {
      this.setState({
        predictions: predictions.prediction.prd
      });
      console.log(this.state.predictions);
    }).bind(this));


    // UserActions.listenForRouteViewed(() => {
    //   //
    //   // AsyncStorage.setItem(...);
    // });
  },

  getInitialState: function() {
    return {
      isMenuOpen: true,
    };
  },

  openMenu: function() {
    this.setState({
      isMenuOpen: true,
    });
  },

  handleRouteSelection: function(route) {
    this.setState({
      selectedRoute: route,
      isMenuOpen: false,
      selectedStop: null,
      predictions: null // Hide the predictions but we should show a loader
    });

    api.getDirections(route).then((directions) => {
      this.setState({
        directions: directions,
        selectedDirection: directions[0],
      });
      console.log(this.state.selectedDirection);
      this.getNearestStop();
    });
  },

  updateDirection: function(direction) {
    this.setState({
      selectedDirection: direction,
      selectedStop: null,
      predictions: null // Hide the predictions but we should show a loader
    });
    console.log(this.state.selectedDirection);
    this.getNearestStop();
  },

  getNearestStop: function() {
    api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (selectedStop) => {
      this.setState({
        selectedStop: selectedStop,
      });

      this.getPredictions();
    });
  },

  getPredictions: function() {
    api.getPredictions(this.state.selectedRoute, this.state.selectedStop).then((response) => {
      if (response.hasOwnProperty('error')) {
        this.setState({
          predictions: null,
          error: response['error'][0],
        });
      }
      else {
        this.setState({
          predictions: response['prd'],
          error: null,
        });
      }
    });
  },

});

 var Dimensions = require('Dimensions');
 var deviceWidth = Dimensions.get('window').width;
 var deviceHeight = Dimensions.get('window').height;

 var styles = StyleSheet.create({
  contentView: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#132C5B',
    flex: 1,
  },
  menuSearch: {
    backgroundColor: '#FFFFFF',
    height: 40,
    padding: 11,
    margin: 10,
    marginTop: 25,
    marginBottom: 15,
    width: deviceWidth * 0.74,
    borderRadius: 22,
    color: '#333',
    fontSize: 19,
    fontFamily: 'ProximaNovaLight'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    padding: 10
  },
  menuRouteNumberContainer: {
    backgroundColor: '#FDC053',
    width: 35,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuRouteNumber: {
    color: '#664100',
    fontWeight: '600',
    alignSelf: 'center',
    fontFamily: 'ProximaNovaSemiBold'
  },
  menuRouteName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 12,
    fontFamily: 'ProximaNovaLight'
  },
  container: {
    flex: 1,
    backgroundColor: '#28519E'
  },
  contentViewHeader: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64
  },
  contentViewHeaderIcon: {
    marginLeft: 18,
    marginTop: 10
  },
  contentViewHeaderDummyRightSpace: {
    marginRight: 18,
    marginTop: 10,
    width: 25,
    height: 19
  },
  contentViewHeaderRouteNumberAndNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentViewHeaderRouteNumberContainer: {
    backgroundColor: '#FDC053',
    width: 35,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  contentViewHeaderRouteNumber: {
    color: '#664100',
    fontWeight: '600',
    alignSelf: 'center',
    fontFamily: 'ProximaNovaSemiBold'
  },
  contentViewHeaderRouteName: {
    color: '#274A8D',
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    fontFamily: 'ProximaNovaLight'
  },
  minutes: {
    fontSize: 140,
    fontWeight: '100',
    color: 'white',
    marginTop: 40,
    alignSelf: 'center',
    fontFamily: 'ProximaNovaThin'
  },
  minutesLabel: {
    fontSize: 24,
    color: 'white',
    opacity: 0.5,
    alignSelf: 'center',
    fontFamily: 'ProximaNovaLight'
  },
  nextPrediction: {
    color: 'white',
    marginTop: 60,
    opacity: 0.7,
    fontSize: 22,
    alignSelf: 'center',
    fontFamily: 'ProximaNovaLight'
  },
  stop: {
    color: 'white',
    marginTop: 45,
    fontSize: 22,
    alignSelf: 'center',
    fontFamily: 'ProximaNovaLight'
  },
  destination: {
    color: 'white',
    opacity: 0.5,
    fontSize: 19,
    marginTop: 10,
    alignSelf: 'center',
    fontFamily: 'ProximaNovaLight'
  },
  directions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  direction: {
    flex: 0.5,
    height: 44,
    alignItems: 'center'
  },
  directionText: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#6884BA',
    fontFamily: 'ProximaNovaLight'
  },
  directionTextActive: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'white',
    fontFamily: 'ProximaNovaLight'
  }
});


const UserActions = {
  refreshPredictions(route, direction, prediction) {
    return new Promise((resolve, reject) => {
      console.log('refreshing prediction for... ' + route.rtnm + ' - ' + direction.dir);

      // Skipping state to just grab this from the API call down there
      // This is probably bad
      var selectedStop;


      setTimeout(() => {
      // Get the nearest stop because the user may have moved
        api.getNearestStop(route, direction, (selectedStop) => {
          console.log(route, direction);
          console.log(selectedStop);
        api.getPredictions(route, selectedStop).then((response) => {
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
  }
};




AppRegistry.registerComponent('AllAboardReact', () => AllAboardReact);
