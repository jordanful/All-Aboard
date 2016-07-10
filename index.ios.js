import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  AsyncStorage,
  Component,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Menu from '/../src/components/menu';
import SideMenu from 'react-native-side-menu';
import ContentView from '/../src/components/content-view'
import UserActions from '/../src/actions/user.js';
import DismissKeyboard from 'dismissKeyboard';
import Styles from '/../src/styles/styles.ios'
import Api from '/../src/api/api';

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
      this.getNearestStop();
    });
  }

  updateDirection(direction) {
    this.setState({
      selectedDirection: direction,
      selectedStop: null,
      predictions: null // Hide the predictions but we should show a loader
    });
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

AppRegistry.registerComponent('AllAboardReact', () => AllAboardReact);
