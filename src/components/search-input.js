import React, { Component } from 'react';

import {
  TextInput,
  View,
  Text,
} from 'react-native';

import Styles from '../styles/styles.ios';

export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
  }

  render() {
    let { onChange } = this.props;
    return (
      <TextInput
        ref={this.searchInputRef}
        style={Styles.menuSearch}
        autoCapitalize='words'
        autoCorrect={false}
        blurOnSubmit={true}
        clearButtonMode='while-editing'
        placeholder='Search routes'
        placeholderTextColor='rgba(255,255,255,0.3)'
        clearTextOnFocus={true}
        returnKeyType='search'
        onChangeText={onChange} />
    );
  }
}
