import React, { ActivityIndicatorIOS } from 'react-native';

export default class LoadingIndicator extends React.Component {
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
