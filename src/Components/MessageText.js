import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { LIGHT_BLUE } from '../constants/colors';

export default ({
  message: {
    id,
    groupID,
    senderID,
    content,
    sentTime,
    trackID,
    trackInfo
  },
  userID,
  usersByID
}) => {

  return (
    <Text>This is text</Text>
  );
};