import {AsyncStorage} from 'react-native'
import uuid from 'react-native-uuid'
import { recentRoutes } from '../../src/constants/routes.js';

export default Storage = {

  async addRecentlyViewedRoute() {
    let key = uuid.v4();
    try {
      await AsyncStorage.setItem(key, JSON.stringify(recentRoutes), () => {
        AsyncStorage.getItem(key, (err, result) => {
          console.log(key, result);
        })
      })
    } catch (error) {
      console.log('there was an error', error);
    }
  }
  //
  // async getRecentlyViewedRoutes() {
  //   let key = uuid.v4();
  //   try {
  //     let recentRoutes = await AsyncStorage.getItem(key);
  //     console.log(recentRoutes.json());
  //     return recentRoutes.json();
  //   }
  //   catch (error) {
  //     console.log('caught error getting recent routes', error);
  //   }
  // }
  // addRecentlyViewedRoute(route)
  // let key = uuid.v4();
  // try {
  // await AsyncStorage.mergeItem(key, route, callback)
  // } catch {
  // // handle error
  //}

  // getRecentlyViewedRoutes()
  // try {
  // const value = await AsyncStorage.getItem(...);
  // if (value !== null) {
    // console.log(value);
    //}
  //} catch {
  // // handle error
  //}
}
