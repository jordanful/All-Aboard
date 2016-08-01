import React, { Component, PropTypes, } from 'react';

import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';

import Styles from '../styles/styles.ios';
import UserActions from '../actions/user.js';

export default class RecentlyViewedRoutes extends React.Component {

  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  static defaultProps = {
    routes: [],
  };


  render() {
    let { routes } = this.props;

    return (
      <View style={Styles.recentlyViewedRoutes}>
        <ScrollView horizontal={true} scrollsToTop={false} showsHorizontalScrollIndicator={false}>
          { routes.map((route, i) =>
            <TouchableOpacity
              onPress={() => UserActions.handleRouteSelection(route)}
              key={i}
              style={Styles.recentlyViewedRoute}>
              <Text allowFontScaling={false} style={Styles.recentlyViewedRouteNumber}>
                {route.rt}
              </Text>
            </TouchableOpacity>
            )}
        </ScrollView>
      </View>
    );
  }

}
