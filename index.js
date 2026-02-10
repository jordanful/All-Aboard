import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';
import Storage from './src/data/storage';
import Menu from './src/components/menu';
import ContentView from './src/components/content-view';
import UserActions from './src/actions/user';
import Styles from './src/styles/styles.ios';

class AllAboard extends Component {
  constructor() {
    super();
    this.openMenu = this.openMenu.bind(this);
    this.drawerRef = React.createRef();
    UserActions.handleRouteSelection = UserActions.handleRouteSelection.bind(this);
    UserActions.updateDirection = UserActions.updateDirection.bind(this);
    UserActions.getPredictions = UserActions.getPredictions.bind(this);
    UserActions.getTrainPredictions = UserActions.getTrainPredictions.bind(this);
    UserActions.refreshPredictions = UserActions.refreshPredictions.bind(this);
    this.state = {
      isMenuOpen: true,
      isLoading: false,
    };
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const { bottomInset } = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={Styles.rootContainer}>
          <StatusBar barStyle={this.state.isMenuOpen ? 'light-content' : 'dark-content'} />
          <Drawer
            ref={this.drawerRef}
            drawerStyle={{ width: deviceWidth * 0.84 }}
            drawerPosition="left"
            drawerType="slide"
            open={this.state.isMenuOpen}
            onOpen={() => this.setState({ isMenuOpen: true })}
            onClose={() => this.setState({ isMenuOpen: false })}
            renderDrawerContent={() => (
              <SafeAreaView
                style={Styles.menuContainer}
                edges={['top', 'left']}
              >
                <Menu
                  activeRoute={this.state.selectedRoute}
                  onSelect={UserActions.handleRouteSelection}
                  recentlyViewedRoutes={this.state.recentRoutes}
                  bottomInset={bottomInset}
                />
              </SafeAreaView>
            )}
          >
            <View style={Styles.contentSafeTop}>
              <SafeAreaView edges={['top']} style={{ backgroundColor: '#FFFFFF' }} />
              <ContentView
                onLeftButtonPress={this.openMenu}
                onChooseDirection={UserActions.updateDirection}
                activeRoute={this.state.selectedRoute}
                directions={this.state.directions}
                selectedDirection={this.state.selectedDirection}
                selectedStop={this.state.selectedStop}
                predictions={this.state.predictions}
                error={this.state.error}
                alerts={this.state.alerts}
              />
            </View>
          </Drawer>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  componentDidMount() {
    UserActions.listenForRefreshPredictions(((predictions) => {
      this.setState({
        predictions: predictions.prediction.prd
      });
    }).bind(this));

    Storage.getRecentlyViewedRoutes().then((recentlyViewedRoutes) => {
      this.setState({
        recentRoutes: recentlyViewedRoutes,
      });
    });
  }

  openMenu() {
    this.setState({
      isMenuOpen: true
    });
  }
}

function AllAboardWithInsets() {
  const insets = useSafeAreaInsets();
  return <AllAboard bottomInset={insets.bottom} />;
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AllAboardWithInsets />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent('AllAboard', () => App);
