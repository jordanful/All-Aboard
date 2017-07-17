import React, { Component } from 'react';

import {
  AppState,
  TextInput,
} from 'react-native';

export default class SearchInput extends Component {
  render() {
    let { onChange } = this.props;
    return (
      <TextInput
        ref='searchInput'
        style={Styles.menuSearch}
        autoCapitalize='words'
        autoCorrect={false}
        blurOnSubmit={true}
        clearButtonMode='always'
        placeholder='Search for a route'
        placeholderTextColor='#BABABA'
        clearTextOnFocus={true}
        returnKeyType='default'
        onChangeText={onChange} />
    );
  }
}
