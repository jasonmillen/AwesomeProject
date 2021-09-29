import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

export default class Search extends Component {

  constructor({ text }) {
    super();

    this.state = {
      text: text || ''
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

  render() {

    const { text } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.search}>
          {/* <Ionicons name='md-search' size={25} style={styles.searchIcon} color='grey' /> */}
          <TextInput
            //autoFocus={true}
            style={styles.input} 
            value={text}
            placeholder='Search for song here...'
            placeholderTextColor='grey'
            onChangeText={newText => this.handleChangeText(newText)} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    //width: '100%',
    flex: 1,
    //backgroundColor: GREY_GREEN,
    //marginLeft: -20,
  },
  search: {
    //margin: 3,
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 20,
    //backgroundColor: GREY_GREEN
  },
  input: {
    flex: 1,
    //borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    height: 50,
    borderRadius: 20,
    //backgroundColor: GREY_GREEN
  }
});