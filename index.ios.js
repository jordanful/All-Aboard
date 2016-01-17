'use strict';

var React = require('react-native');
var SideMenu = require('react-native-side-menu');
var api = require('/../api');


var {
  AppRegistry,
  AppStateIOS,
  StyleSheet,
  StatusBarIOS,
  ListView,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicatorIOS,
  TouchableHighlight,
  TouchableOpacity,
  TextInput
} = React;


var Menu = React.createClass({
  componentDidMount: function() {
    this.getAllRoutes(),
    AppStateIOS.addEventListener('change', this.handleAppStateChange);
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
      routeDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      filterText: ''
    }
  },

  getAllRoutes: function() {
    api.getAllRoutes()
      .then((responseData) => responseData['bustime-response']['routes'])
      .then((routes) => this.setState({
        routeDataSource: this.state.routeDataSource.cloneWithRows(routes)
      }));
  },

  render: function() {
    return (
      <View style={styles.menuContainer}>
        <SearchBar/>
        <ListView
          dataSource={this.state.routeDataSource} 
          renderRow={this.renderRoute}
        />
      </View>
    );
  },

  renderRoute: function(route) {
    return (
      <TouchableHighlight
        onPress={() => this.props.onSelect(route)}
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
  getInitialState: function() {
    return {
        text: ''
      }
  },
  render: function() {
    return (
      <TextInput 
        ref='searchInput'
        style={styles.menuSearch} 
        autoCapitalize= 'words' 
        autoCorrect= {false}
        clearButtonMode= 'while-editing'
        placeholder='Search for a route'
        placeholderTextColor='#6C82A6'
        clearTextOnFocus = {true}
        returnKeyType= 'go'
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}/>
    );
  }
});

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
    };

    return DIRECTION_NAME_MAP[fullDirectionName];
  }
});

var ContentViewHeader = React.createClass({
  render: function() {
    var activeRoute = this.props.activeRoute || { rtnm: "Chicago", rt: "66", rtclr: "#ff00ff" };

    return (
      <View style={styles.contentViewHeader}>
        <Button onPress={this.props.onLeftButtonPress} />
        <View style={styles.contentViewHeaderRouteNumberAndNameContainer}>
          <View style={styles.contentViewHeaderRouteNumberContainer}>
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
    return (
      <View>
        <Text style={styles.minutes}>12</Text>
        <Text style={styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
});

var Stop = React.createClass({
  render: function() {
    return (
      <Text style={styles.stop}>Michigan & E. Wacker</Text>
    );
  }
});

var Destination = React.createClass({
  render: function() {
    return(
      <Text style={styles.destination}>To Wacker/Columbus</Text>
    );
  }
});

var NextPrediction = React.createClass({
  render: function() {
    return(
      <Text style={styles.nextPrediction}>21 minutes</Text>
    );
  }
});

var ContentView = React.createClass({
  render: function() {
    var activeRoute = this.props.activeRoute;
    var directions = this.props.directions;
    var selectedDirection = this.props.selectedDirection;

    return (
      <View style={styles.contentView}>
        <ContentViewHeader activeRoute={activeRoute} onLeftButtonPress={this.props.onLeftButtonPress} />
        <ScrollView style={styles.container} activeRoute={activeRoute}>
          <Directions directions={directions} selectedDirection={selectedDirection} onChooseDirection={this.props.onChooseDirection} />
          <Minutes activeRoute={activeRoute}/>
          <Stop/>
          <Destination/>
          <NextPrediction/>
        </ScrollView>
      </View>
      );
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
        openMenuOffset={300}
        isOpen={this.state.isMenuOpen}
        menu={menu}
        >
        <ContentView
          onLeftButtonPress={this.openMenu}
          onChooseDirection={this.updateDirection}

          activeRoute={this.state.selectedRoute}
          directions={this.state.directions}
          selectedDirection={this.state.selectedDirection}
          />
      </SideMenu>
    );
  },

  getInitialState: function() {
    return {
      isMenuOpen: false,
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
    });

    api.getDirections(route).then((directions) => {
      this.setState({
        directions: directions,
        selectedDirection: directions[0],
      });
    });
  },

  updateDirection: function(direction) {
    this.setState({
      selectedDirection: direction,
    });
  },

  // setRoute: function(route) {
  //   this.setState({selectedRoute:(route)}, function() {
  //     api.getDirections(route, function(direction) {
  //       api.getNearestStop(route, direction, function(nearestStop) {
  //         console.log('the nearest stop for ' + route.rtnm + ' is ' + nearestStop.stpnm + ', ' + nearestStop.stpid);
  //         api.getPredictions(route, nearestStop, function(prediction) {
  //           console.log('The bus will arrive in ' + prediction.prd[0].prdctdn + ' minutes and is headed toward ' + prediction.prd[0].des + '.')
  //           this.setState({prediction:(prediction)})
  //         });
  //       });
  //     });
  //   });
  // },


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
    backgroundColor: '#1A3C75',
    borderColor: '#1A3C75',
    height: 40,
    padding: 11,
    margin: 10,
    marginTop: 25,
    marginBottom: 15,
    width: deviceWidth * 0.74,
    borderRadius: 22,
    color: '#FFFFFF',
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
    color: 'white',
    fontFamily: 'ProximaNovaLight'
  },
  directionTextActive: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#6884BA',
    fontFamily: 'ProximaNovaLight'
  }
});

AppRegistry.registerComponent('AllAboardReact', () => AllAboardReact);


