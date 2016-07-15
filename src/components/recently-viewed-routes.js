import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class RecentlyViewedRoutes extends React.Component {
  render() {
    return (
      <View style={Styles.recentlyViewedRoutes}>
        <View style={Styles.recentlyViewedRoute}>
          <Text style={Styles.recentlyViewedRouteNumber}>
            66
          </Text>
        </View>

        <View style={Styles.recentlyViewedRoute}>
          <Text style={Styles.recentlyViewedRouteNumber}>
            66
          </Text>
        </View>
        <View style={Styles.recentlyViewedRoute}>
          <Text style={Styles.recentlyViewedRouteNumber}>
            66
          </Text>
        </View>
    </View>
    );
  }
}
