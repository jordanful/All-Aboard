import { take, uniqBy } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'recentRoutes';

export default Storage = {

  addRecentlyViewedRoute(route) {
    return new Promise((resolve, reject) => {
      this.getRecentlyViewedRoutes().then((recentlyViewedRoutes) => {

        // Add route to front of list.
        recentlyViewedRoutes.unshift(route);

        // Remove duplicates from list (combine rt + type for uniqueness).
        recentlyViewedRoutes = uniqBy(recentlyViewedRoutes, r => (r.type || 'bus') + '-' + r.rt);

        // Take the first 10 routes from list.
        recentlyViewedRoutes = take(recentlyViewedRoutes, 10)

        AsyncStorage.setItem(key, JSON.stringify(recentlyViewedRoutes)).then(() => {
          resolve(recentlyViewedRoutes);
        });
      });
    });
  },

  getRecentlyViewedRoutes() {
    return AsyncStorage.getItem(key).then((recentlyViewedRoutes) => {
      return recentlyViewedRoutes ? JSON.parse(recentlyViewedRoutes) : [];
    });
  }

}
