import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import UserActions from '../../src/actions/user.js';
import { recentRoutes } from '../../src/constants/routes.js'; // TODO remove this - its just for testing

export default class RecentlyViewedRoutes extends React.Component {
  render() {
    // let recentRoutes = this.props.routes || [];
    return (
      <View style={Styles.recentlyViewedRoutes}>
      <ScrollView horizontal={true} scrollsToTop={false} showsHorizontalScrollIndicator={false}>
        { recentRoutes.map((route, i) =>
          <TouchableOpacity
            onPress={() =>
                        UserActions.handleRouteSelection(route)}
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
