import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import {
  TouchableOpacity
} from 'react-native';

export default (props) => {

  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
    >
      <Ionicons name='md-search' size={30} />
      
    </TouchableOpacity>
  )
};