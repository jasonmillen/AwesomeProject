import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LIGHT_GREEN, GREY_GREEN } from '../constants/colors';

export default class Search extends Component {

  constructor({ text }) {
    super();

    this.state = {
      text: text || '',
      height: 40,
    };
  }

  handleChangeText(newText) {

    const { onChange } = this.props;

    this.setState({
      text: newText
    }, () => {
      onChange && onChange(newText);
    });
  }

  updateSize(e, height) {
    console.log("setting height: " + height)
    console.log(e.nativeEvent)
    height = Math.max(35, height + 20);
    this.setState({
      height
    });
  }

  render() {

    const { text, height } = this.state;

    const _styles = getStyles();
    _styles.input.height = height;

    return (
      <View style={styles.container}>
        <View style={styles.search}>
          {/* <Ionicons name='md-search' size={25} style={styles.searchIcon} color='grey' /> */}
          <TextInput
            //autoFocus={true}
            style={_styles.input} 
            value={text}
            placeholder='Type something here!'
            placeholderTextColor='grey'
            onChangeText={newText => this.handleChangeText(newText)}
            multiline={true}
            onContentSizeChange={(e) => this.updateSize(e, e.nativeEvent.contentSize.height)}/>
        </View>
      </View>
    );
  }
};

const getStyles = () => {
  return {
    input: {
      //flex: 1,
      //borderWidth: 1,
      //width: '100%',
      paddingTop: 10,
      paddingBottom: 10,
      //textAlign: 'center',
      borderColor: 'black',
      padding: 10,
      borderRadius: 20,
      backgroundColor: GREY_GREEN
    }
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 2,
    //width: '100%',
    //flex: 0.2,
    //backgroundColor: GREY_GREEN,
    //marginLeft: -20,
  },
  search: {
    // //margin: 3,
    //flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
    //borderRadius: 20,
    //backgroundColor: 'yellow'
  }
});