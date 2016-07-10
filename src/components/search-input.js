import React, {
  AppStateIOS,
  Component,
  TextInput,
} from 'react-native';

export default class SearchInput extends React.Component {

  // when a route is selected or the menu button is tapped
  // we should
  // 1) blur the field
  // 2) reset the filtertext

  // when the textinput is focused
  // we should
  // 1) reset the filtertext

  render() {
    let { onChange } = this.props;
    return (
      <TextInput
        ref='searchInput'
        style={Styles.menuSearch}
        autoCapitalize='words'
        autoCorrect={false}
        blurOnSubmit={true}
        clearButtonMode='while-editing'
        placeholder='Search for a route'
        placeholderTextColor='#BABABA'
        clearTextOnFocus={true}
        returnKeyType='default'
        onChangeText={onChange} />
    );
  }
}
