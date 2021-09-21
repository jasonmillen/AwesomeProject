import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { LIGHT_BLUE } from '../constants/colors';

import {
  TouchableOpacity
} from 'react-native';

export default (props) => {

  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => props.onPress()}>
      <Ionicons name='md-send' size={25} color={LIGHT_BLUE} />
    </TouchableOpacity>
  )
};