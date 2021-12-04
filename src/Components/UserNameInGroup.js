import React from 'react';
import { 
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { GREY_GREEN, LIGHT_GREEN, DARK_GREEN } from '../constants/colors';

import { useTheme } from '@react-navigation/native';

export default ({ 
  displayName,
  onRemove,
}) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={_styles.displayName}>{displayName}</Text>
      <TouchableOpacity style={styles.cancelButton} onPress={onRemove}>
        <MaterialIcons name='cancel' size={22} />
      </TouchableOpacity>
    </View>
  );

};

const getStyles = (theme) => {
  return {
    displayName: {
      margin: 2,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 7,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 3,
    flexDirection: 'row',
  },
  cancelButton: {
    marginLeft: 2,
  }
});