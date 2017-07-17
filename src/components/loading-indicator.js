import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';

export default class LoadingIndicator extends Component {
  constructor() {
    super();
  }
  render() {
     return (
       <ActivityIndicatorIOS
         style={[Styles.center, {height: 400}]}
         color="white"
         size="large"
       />
     );
   }
}
