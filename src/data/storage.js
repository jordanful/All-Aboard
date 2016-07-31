import {AsyncStorage} from 'react-native'

const key = 'recentRoutes';

export default Storage = {

  async addRecentlyViewedRoute(route) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(route), () => {
        AsyncStorage.getItem(key, (err, result) => {
          console.log('set the recently viewed route as', result);
          return result;
        })
      })
    } catch (error) {
      console.log('there was an error', error);
    }
  },

  async getRecentlyViewedRoutes() {
    try {
      const recentRoutes = await AsyncStorage.getItem(key);
      if (recentRoutes !== null) {
        return recentRoutes;
      }
    } catch (error) {
      console.log(key, 'caught error getting recent routes', error);
    }
  }

}
