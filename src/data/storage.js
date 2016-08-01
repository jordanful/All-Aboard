import { take, uniqBy } from 'lodash';
import { AsyncStorage } from 'react-native'

const key = 'recentRoutes';

export default Storage = {

  addRecentlyViewedRoute(route) {
    return new Promise((resolve, reject) => {
      this.getRecentlyViewedRoutes().then((recentlyViewedRoutes) => {

        // Add route to front of list.
        recentlyViewedRoutes.unshift(route);

        // Remove duplicates from list.
        recentlyViewedRoutes = uniqBy(recentlyViewedRoutes, 'rt');

        // Take the first 10 routes from list.
        recentlyViewedRoutes = take(recentlyViewedRoutes, 10)

        AsyncStorage.setItem(key, JSON.stringify(recentlyViewedRoutes), () => {
          resolve(recentlyViewedRoutes);
        });
      });
    });
  },

  getRecentlyViewedRoutes() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (err, recentlyViewedRoutes) => {
        resolve(recentlyViewedRoutes ? JSON.parse(recentlyViewedRoutes) : []);
      });
    });
  }

}
