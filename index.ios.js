import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  AppStateIOS,
  AsyncStorage,
  Component,
  Image,
  ListView,
  RefreshControl,
  ScrollView,
  StatusBarIOS,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Api from '/../src/api/api';
import _ from 'lodash';
import SideMenu from 'react-native-side-menu';
import DismissKeyboard from 'dismissKeyboard';
import Styles from '/../src/styles/styles.ios'

// TODO this might make things easier
// class BaseComponent extends React.Component {
//   _bind(...methods) {
//   methods.forEach( (method) => this[method] = this[method].bind(this) );
//  }
// }


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._filterRoutes = this._filterRoutes.bind(this);
    this.getAllRoutes = this.getAllRoutes.bind(this);
    this.renderRoute = this.renderRoute.bind(this);
    this.state = {
      selectedRoute: null,
      prediction: null,
      userLocation: '',
      inputFocused: false,
      allRoutes: [],
      routeDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      filterText: ''
      // recentRoutes:
    };

    // this._bind('_onChange', '_filterRoutes', 'getAllRoutes')
  }

  componentDidMount() {
    this.getAllRoutes(),
    AppStateIOS.addEventListener('change', this.handleAppStateChange);
    AsyncStorage.getItem("recentRoutes").then((value) => {
      this.setState({recentRoutes: value});
    }).done();
  }

  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(state) {
    if (!this.state.loaded) {
      this.getAllRoutes()
    }
  }

  getAllRoutes() {
    Api.getAllRoutes()
      .then((responseData) => responseData['bustime-response']['routes'])
      .then((routes) => this.setState({
        allRoutes: routes,
      }));
  }

  render() {
    let { allRoutes, filterText } = this.state;
    let filteredRoutes = filterText.length > 0
      ? this._filterRoutes(allRoutes, filterText)
      : allRoutes;

    return (
      <View style={Styles.menuContainer}>
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
  }

  _onChange(text) {
    this.setState({
      filterText: text,
    });
  }

  _filterRoutes(routes, filterText) {
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
  }

  renderRoute(route) {
    return (
      <TouchableHighlight
        onPress={() => this.props.onSelect(route)}
                    // && UserActions.viewRoute(route)}
        underlayColor='#0D1F42'
      >
        <View style={Styles.row}>
          <View style={Styles.menuRouteNumberContainer}>
            <Text style={Styles.menuRouteNumber}>
              {route.rt}
            </Text>
          </View>
          <Text style={Styles.menuRouteName}>
            {route.rtnm}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class SearchBar extends React.Component {

  // when a route is selected or the menu button is tapped
  // we should
  // 1) blur the field
  // 2) reset the filtertext

  // when the textinput is focused
  // we should
  // 1) reset the filtertext

  render() {
    let { onChange } = this.props;
    return (
      <TextInput
        ref='searchInput'
        style={Styles.menuSearch}
        autoCapitalize='words'
        autoCorrect={false}
        blurOnSubmit={true}
        clearButtonMode='while-editing'
        placeholder='Search for a route'
        placeholderTextColor='#BABABA'
        clearTextOnFocus={true}
        returnKeyType='default'
        onChangeText={onChange} />
    );
  }
}
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
class Directions extends React.Component {
  constructor() {
    super();
    this._prettyName = this._prettyName.bind(this);
  }

  render() {
    var directions = this.props.directions || [];

    return (
      <View style={Styles.directions}>
        { directions.map((direction, i) =>
          <TouchableOpacity key={i} style={Styles.direction} onPress={() => this.props.onChooseDirection(direction)}>
            <Text style={direction.dir == this.props.selectedDirection.dir ? Styles.directionTextActive : Styles.directionText}>
              {this._prettyName(direction.dir)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  _prettyName(fullDirectionName) {
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
}

class ContentViewHeader extends React.Component {
  render() {
    let activeRoute = this.props.activeRoute || { rtnm: "Choose Route", rt: "" };

    return (
      <View style={Styles.contentViewHeader}>
        <Button onPress={this.props.onLeftButtonPress}  />
        <View style={Styles.contentViewHeaderRouteNumberAndNameContainer}>
          <View style={activeRoute.rt && Styles.contentViewHeaderRouteNumberContainer}>
            <Text style={Styles.contentViewHeaderRouteNumber}>
              {activeRoute.rt}
            </Text>
          </View>
          <Text style={Styles.contentViewHeaderRouteName}>
            {activeRoute.rtnm}
          </Text>
        </View>
        <View style={Styles.contentViewHeaderDummyRightSpace}></View>
      </View>
    );
  }
}

class Button extends React.Component  {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image style={Styles.contentViewHeaderIcon} source={require('./assets/images/contentViewHeaderIcon.png')} />
      </TouchableOpacity>
    );
  }
}

class Minutes extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null };

    return (
      <View>
        <Text style={Styles.minutes}>{prediction.prdctdn}</Text>
        <Text style={Styles.minutesLabel}>minutes</Text>
      </View>
      );
  }
}

class Stop extends React.Component {
  render() {
    var stop = this.props.stop;
    if (!stop) { return null; }

    return (
      <Text style={Styles.stop}>{stop.stpnm}</Text>
    );
  }
}

class Destination extends React.Component {
  render() {
    var prediction = this.props.predictions && this.props.predictions[0];
    if (!prediction) { return null; }

    return(
      <Text style={Styles.destination}>To {prediction.des}</Text>
    );
  }
}

class NextPrediction extends React.Component {
  render() {
    let prediction = this.props.prediction;
    if (!prediction) { return null };
    return(
      <Text style={Styles.nextPrediction}>{prediction.prdctdn} minutes</Text>
    );
  }
}

class Error extends React.Component {
  render() {
    let { error } = this.props;
    return (
      <Text style={Styles.nextPrediction}>
        {error.msg}
      </Text>
    )
  }
}

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this._onRefresh = this._onRefresh.bind(this);
    this.state = {
        predictions: props.predictions,
        isRefreshing: false,
      };
    // this._bind('_onRefresh');
  }

  render() {
    let { activeRoute, error } = this.props;
    return (
      <View style={Styles.contentView}>
        <ContentViewHeader activeRoute={activeRoute} onLeftButtonPress={this.props.onLeftButtonPress} />
          <ScrollView
            style={Styles.container}
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
  }

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
}

class AllAboardReact extends React.Component {

  constructor() {
    super();
    this.openMenu = this.openMenu.bind(this);
    this.handleRouteSelection = this.handleRouteSelection.bind(this);
    this.updateDirection = this.updateDirection.bind(this);
    this.getNearestStop = this.getNearestStop.bind(this);
    this.getPredictions = this.getPredictions.bind(this);
    this.state = {isMenuOpen: true}
  }

  render() {
    // TODO refactor this into a module that styles can use, too
    // make sure Dimensions are set in render function, in case we support
    // landscape orientation or something in the future
    const Dimensions = require('Dimensions');
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const menu = (
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
  }

  componentDidMount() {
    UserActions.listenForRefreshPredictions(((predictions) => {
      this.setState({
        predictions: predictions.prediction.prd
      });
    }).bind(this));

    // UserActions.listenForRouteViewed(() => {
    //   //
    //   // AsyncStorage.setItem(...);
    // });
  }

  openMenu() {
    this.setState({
      filterText: '',
      isMenuOpen: true
    });
  }

  handleRouteSelection(route) {
    // TODO blur the text input & reset the filter text
    this.setState({
      selectedRoute: route,
      filterText: '', // this isn't working
      isMenuOpen: false,
      inputFocused: false,
      selectedStop: null,
      predictions: null // Hide the predictions but we should show a loader
    });

    Api.getDirections(route).then((directions) => {
      this.setState({
        directions: directions,
        selectedDirection: directions[0],
      });
      console.log(this.state.selectedDirection);
      this.getNearestStop();
    });
  }

  updateDirection(direction) {
    this.setState({
      selectedDirection: direction,
      selectedStop: null,
      predictions: null // Hide the predictions but we should show a loader
    });
    console.log(this.state.selectedDirection);
    this.getNearestStop();
  }

  getNearestStop() {
    Api.getNearestStop(this.state.selectedRoute, this.state.selectedDirection, (selectedStop) => {
      this.setState({
        selectedStop: selectedStop,
      });

      this.getPredictions();
    });
  }

  getPredictions() {
    Api.getPredictions(this.state.selectedRoute, this.state.selectedStop).then((response) => {
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
  }
}

const UserActions = {
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
  }
};

AppRegistry.registerComponent('AllAboardReact', () => AllAboardReact);
