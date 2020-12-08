import React from 'react';

import {
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default (props) => {

  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => props.onPress()}
    >
      <Text style={styles.text}>Log Out</Text>
      
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white'
  }
});