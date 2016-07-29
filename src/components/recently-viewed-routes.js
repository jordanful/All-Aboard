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
    // let recentRoutes = this.props.routes || [];
    const recentRoutes = [ // dummy for building out UI
      {
        rt: '76',
        rtnm: 'Test route',
      },
      {
        rt: '66',
        rtnm: 'Chicago',
      },
      {
        rt: '12-B',
        rtnm: 'Alberta',

      },
      {
        rt: '56',
        rtnm: 'Milwaukee',

      },
      {
        rt: '198',
        rtnm: 'Cleveland Express',
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
