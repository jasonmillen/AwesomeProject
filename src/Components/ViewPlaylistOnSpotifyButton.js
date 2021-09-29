import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import {
  TouchableOpacity
} from 'react-native';

export default (props) => {

  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => props.onPress()}
    >
      <Ionicons name='ios-arrow-forward' size={30} style={{opacity: 1}} />
      
    </TouchableOpacity>
  )
};