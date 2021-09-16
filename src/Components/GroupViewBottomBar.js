import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import { HeaderHeightContext } from "@react-navigation/stack";

import SendMessageTextInput from './SendMessageTextInput';

export default ({}) => {

  return (
    <HeaderHeightContext.Consumer>
      {headerHeight => (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
          keyboardVerticalOffset={headerHeight}>
          <View style={styles.bar}>
            <SendMessageTextInput onChange={(text) => console.log(`input text changed: ${text}`)} />
          </View>
        </KeyboardAvoidingView>
      )}
    </HeaderHeightContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  keyboardAvoidingView: {
    width: '100%',
    //backgroundColor: 'yellow'
  },
  bar: {
  }
});