import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LIGHT_GREEN, GREY_GREEN } from '../constants/colors';

export default class SendMessageTextInput extends Component {

  constructor({ text }) {
    super();

    this.state = {
      text: text || '',
      height: 40,
    };
  }

  updateSize(e, height) {
    height = Math.max(35, height + 20);
    this.setState({
      height
    });
  }

  render() {

    const { height } = this.state;

    const _styles = getStyles();
    _styles.input.height = height;

    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput
            style={_styles.input} 
            value={this.props.text}
            placeholder='Type something here!'
            placeholderTextColor='grey'
            onChangeText={newText => this.props.onChange(newText)}
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
      paddingTop: 10,
      paddingBottom: 10,
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
    flex: 1,
  },
  search: {
  }
});