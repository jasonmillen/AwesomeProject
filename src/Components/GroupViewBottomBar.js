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
    <HeaderHeightContext.Consumer style={styles.container}>
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
    alignSelf: "flex-end"
  },
  keyboardAvoidingView: {
    width: '100%',
    //backgroundColor: 'yellow'
  },
  bar: {
  }
});