import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import Styles from '../styles/styles.ios';
import UserActions from '../actions/user.js';

export default class RecentlyViewedRoutes extends Component {
  static defaultProps = {
    routes: [],
  };

  render() {
    let { routes } = this.props;
    if (!routes || routes.length === 0) return null;

    return (
      <View style={Styles.recentlyViewedContainer}>
        <Text allowFontScaling={false} style={Styles.recentlyViewedLabel}>
          Recent
        </Text>
        <ScrollView
          horizontal={true}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={Styles.recentlyViewedScroll}
        >
          { routes.map((route, i) => {
            let isTrain = route.type === 'train';
            return (
              <TouchableOpacity
                onPress={() => UserActions.handleRouteSelection(route)}
                key={i}
                style={[
                  Styles.recentlyViewedRoute,
                  isTrain && { backgroundColor: route.color },
                ]}
                activeOpacity={0.7}
              >
                <Text allowFontScaling={false} style={[
                  Styles.recentlyViewedRouteNumber,
                  isTrain && { color: route.textColor },
                ]}>
                  {isTrain ? route.rt.charAt(0) : route.rt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
