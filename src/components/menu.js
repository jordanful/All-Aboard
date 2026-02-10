import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecentlyViewedRoutes from './recently-viewed-routes';
import SearchInput from './search-input';
import UserActions from '../actions/user';
import Styles from '../styles/styles.ios';
import Api from '../api/api';
import { TRAIN_LINES } from '../data/stations';
import _ from 'lodash';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._filterRoutes = this._filterRoutes.bind(this);
    this.getAllRoutes = this.getAllRoutes.bind(this);
    this.renderRoute = this.renderRoute.bind(this);
    this.renderListHeader = this.renderListHeader.bind(this);

    this.state = {
      selectedRoute: null,
      prediction: null,
      userLocation: '',
      inputFocused: false,
      allRoutes: [],
      filterText: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAllRoutes();
    this._appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
    }
  }

  handleAppStateChange = (state) => {
    if (state === 'active') {
      this.getAllRoutes();
    }
  }

  getAllRoutes() {
    Api.getAllRoutes()
      .then((responseData) => responseData['bustime-response']['routes'])
      .then((routes) => this.setState({
        allRoutes: routes,
        isLoading: false,
      }))
      .catch((error) => {
        console.warn('Failed to load routes:', error);
        this.setState({ isLoading: false });
      });
  }

  renderListHeader() {
    let { recentlyViewedRoutes } = this.props;
    let hasRecents = recentlyViewedRoutes && recentlyViewedRoutes.length > 0;
    return (
      <View>
        {hasRecents && (
          <RecentlyViewedRoutes routes={recentlyViewedRoutes} />
        )}
      </View>
    );
  }

  _buildListData() {
    let { allRoutes, filterText } = this.state;
    let isFiltering = filterText.length > 0;

    // Filter train lines
    let trainLines = isFiltering
      ? TRAIN_LINES.filter(line => {
          let ft = filterText.toLowerCase();
          return line.rt.toLowerCase().indexOf(ft) > -1
            || line.rtnm.toLowerCase().indexOf(ft) > -1;
        })
      : TRAIN_LINES;

    // Filter bus routes
    let busRoutes = isFiltering
      ? this._filterRoutes(allRoutes, filterText)
      : allRoutes;

    // Combine with section headers
    let data = [];
    if (trainLines.length > 0) {
      data.push({ _type: 'header', _key: 'h-trains', title: 'Train Lines' });
      trainLines.forEach(line => data.push(line));
    }
    if (busRoutes.length > 0) {
      data.push({ _type: 'header', _key: 'h-buses', title: 'Bus Routes' });
      busRoutes.forEach(route => data.push(route));
    }
    return data;
  }

  render() {
    let isLoading = this.state.isLoading;
    let listData = this._buildListData();

    return (
      <View style={Styles.menuContainer}>
        <View style={Styles.menuHeader}>
          <SearchInput onChange={this._onChange} />
        </View>
        {isLoading ? (
          <ActivityIndicator style={Styles.menuActivityIndicator} size="large" color="#5E73A0"/>
        ) : (
          <FlatList
            data={listData}
            renderItem={({ item }) => {
              if (item._type === 'header') {
                return (
                  <Text allowFontScaling={false} style={Styles.routeListHeader}>
                    {item.title}
                  </Text>
                );
              }
              return this.renderRoute(item);
            }}
            keyExtractor={(item) => item._key || (item.type === 'train' ? 'train-' + item.rt : item.rt)}
            ListHeaderComponent={this.renderListHeader}
            ItemSeparatorComponent={() => <View style={Styles.routeSeparator} />}
            contentContainerStyle={{ paddingBottom: this.props.bottomInset || 34 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )}
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
    let isTrain = route.type === 'train';
    let isActive = this.props.activeRoute && this.props.activeRoute.rt === route.rt
      && this.props.activeRoute.type === route.type;
    let badgeStyle = isTrain
      ? [Styles.menuRouteNumberContainer, { backgroundColor: route.color }]
      : Styles.menuRouteNumberContainer;
    let badgeTextStyle = isTrain
      ? [Styles.menuRouteNumber, { color: route.textColor }]
      : Styles.menuRouteNumber;

    return (
      <TouchableHighlight
        onPress={() => this.props.onSelect(route)}
        underlayColor='rgba(255,255,255,0.05)'
      >
        <View style={[Styles.row, isActive && { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
          <View style={badgeStyle}>
            <Text allowFontScaling={false} style={badgeTextStyle}>
              {isTrain ? route.rt.charAt(0) : route.rt}
            </Text>
          </View>
          <Text allowFontScaling={false} style={Styles.menuRouteName} numberOfLines={1}>
            {route.rtnm}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}
