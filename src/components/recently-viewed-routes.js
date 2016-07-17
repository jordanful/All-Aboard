import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import UserActions from '../../src/actions/user.js';

export default class RecentlyViewedRoutes extends React.Component {
  render() {
    // var recentRoutes = this.props.routes || [];
    const recentRoutes = [ // dummy for building out UI
      {
        rt: '76',
      },
      {
        rt: '66',
      },
      {
        rt: '12-B',
      },
      {
        rt: '56',
      },
      {
        rt: '198',
      },
      {
        rt: '4',
      },
      {
        rt: '402',
      },

    ]

    return (
      <View style={Styles.recentlyViewedRoutes}>
      <ScrollView horizontal={true} scrollsToTop={false} showsHorizontalScrollIndicator={false}>
        { recentRoutes.map((route, i) =>
          <TouchableOpacity
            onPress={() =>
                        UserActions.handleRouteSelection(route)}
            key={i}
            style={Styles.recentlyViewedRoute}>
            <Text style={Styles.recentlyViewedRouteNumber}>
              {route.rt}
            </Text>
          </TouchableOpacity>
          )}
      </ScrollView>
    </View>
    );
  }
}
