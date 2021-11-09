import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';


export default (props) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  return (
    <View style={_styles.searchBar}>
      <TouchableOpacity
        style={styles.searchIconButton}
        onPress={props.handleSearchClick}>
        <Ionicons color='grey' name='md-search' size={30} />
      </TouchableOpacity>
      <TextInput 
        style={_styles.searchUserTextInput} 
        value={props.text}
        onChangeText={text => props.textChanged(text)}
        placeholder={props.placeholderText}
        placeholderTextColor={theme.colors.textInputPlaceholder}
        returnKeyType='search'
        onSubmitEditing={searchEvent => props.handleSearchSubmit(searchEvent.nativeEvent.text)}
      />
      {!!props.text && <TouchableOpacity
        style={styles.clearTextButton}
        onPress={props.clearText}>
        <MaterialIcons color='grey' name='clear' size={30} />
      </TouchableOpacity>}
    </View>
  );
};

const getStyles = (theme) => {
  return {
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      //backgroundColor: GREY_GREEN
      backgroundColor: theme.colors.textInputBackground,
    },
    searchUserTextInput: {
      flex: 1,
      height: 40,
      color: theme.colors.text,
      //borderColor: 'gray',
      //borderWidth: 1
    },
  };
};

const styles = StyleSheet.create({
  searchIconButton: {
    margin: 8
  },
  clearTextButton: {
    margin: 8
  },
});