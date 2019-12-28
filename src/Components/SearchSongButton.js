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
      <Ionicons name='md-musical-notes' size={30} />
      
    </TouchableOpacity>
  )
};