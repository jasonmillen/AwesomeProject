import React from 'react';

import {
  Text,
  TouchableOpacity
} from 'react-native';

export default (props) => {

  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => props.onPress()}
    >
      <Text>Log Out</Text>
      
    </TouchableOpacity>
  )
};