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
    routes: [
      { rt: '8', rtnm: 'Halsted' },
      { rt: '9', rtnm: 'Balsted' },
      { rt: '10', rtnm: 'Galsted' },
      { rt: '11', rtnm: 'Jalsted' },
      { rt: '12', rtnm: 'Kalsted' },
      { rt: '13', rtnm: 'Lalsted' },
      { rt: '14', rtnm: 'Malsted' },
      { rt: '15', rtnm: 'Nalsted' },
      { rt: '16', rtnm: 'Oalsted' },
    ],
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
