import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

import {
  TouchableOpacity
} from 'react-native';

export default (props) => {

  const theme = useTheme();

  return (
    <TouchableOpacity
      style={props.style}
      onPress={() => props.onPress()}
    >
      <Ionicons name='md-musical-notes' size={30} color={theme.colors.icon}/>
      
    </TouchableOpacity>
  )
};