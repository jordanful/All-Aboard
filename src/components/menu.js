import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  AppState,
  AsyncStorage,
  ListView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import RecentlyViewedRoutes from '../../src/components/recently-viewed-routes';
import SearchInput from '../../src/components/search-input';
import UserActions from '../../src/actions/user.js';
import _ from 'lodash';

export default class Menu extends Component {

  static propTypes = {
    recentlyViewedRoutes: PropTypes.array,
  };

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
      filterText: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAllRoutes(),
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(state) {
    if (!state === 'active') {
      this.getAllRoutes()
    }
  }

  getAllRoutes() {
    Api.getAllRoutes()
      .then((responseData) => responseData['bustime-response']['routes'])
      .then((routes) => this.setState({
        allRoutes: routes,
        isLoading: false,
      }));
  }

  render() {
    let { recentlyViewedRoutes } = this.props;
    let { allRoutes, filterText } = this.state;
    let filteredRoutes = filterText.length > 0
      ? this._filterRoutes(allRoutes, filterText)
      : allRoutes;
    let isLoading = this.state.isLoading;
    let listView;
    if (isLoading) {
      listView = <ActivityIndicator style={Styles.menuActivityIndicator} size="large" color="#73829D"/>
    } else {
      listView = <ListView
                  enableEmptySections={true}
                  dataSource={this.state.routeDataSource.cloneWithRows(filteredRoutes)}
                  renderRow={this.renderRoute}
                  />
    }
    return (
      <View style={Styles.menuContainer}>
        <SearchInput onChange={this._onChange} />
        <ScrollView style={Styles.menuRoutes} >
          <RecentlyViewedRoutes
            style={Styles.recentlyViewedRoutesContainer}
            routes={recentlyViewedRoutes}
            />
          {listView}
        </ScrollView>
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
        onPress={() => this.props.onSelect(route)
                     && UserActions.viewRoute(route)}
        underlayColor='#0D1F42'
      >
        <View style={Styles.row}>
          <View style={Styles.menuRouteNumberContainer}>
            <Text allowFontScaling={false} style={Styles.menuRouteNumber}>
              {route.rt}
            </Text>
          </View>
          <Text allowFontScaling={false} style={Styles.menuRouteName}>
            {route.rtnm}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}
