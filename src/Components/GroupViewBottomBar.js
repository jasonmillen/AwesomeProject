import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';

import { HeaderHeightContext } from "@react-navigation/elements";

import SendMessageTextInput from './SendMessageTextInput';
import SendMessageButton from './SendMessageButton';

export default ({
  onUserInputTextChanges,
  onUserSendTextMessage
}) => {

  const [ userInputText, setUserInputText ] = useState('');

  const handleUserInputTextChanges = text => {
    setUserInputText(text);
    onUserInputTextChanges(text);
  };

  const handleUserSendMessageButton = () => {
    onUserSendTextMessage(userInputText);
    setUserInputText('');
    Keyboard.dismiss();
  };

  return (
    <HeaderHeightContext.Consumer style={styles.container}>
      {headerHeight => (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
          keyboardVerticalOffset={headerHeight}>
          <View style={styles.bar}>
            <SendMessageTextInput onChange={handleUserInputTextChanges} text={userInputText} />
            {userInputText.length > 0 && 
              <SendMessageButton 
                onPress={handleUserSendMessageButton}
                style={styles.sendButton}
              />
            }
          </View>
        </KeyboardAvoidingView>
      )}
    </HeaderHeightContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
  },
  keyboardAvoidingView: {
    width: '100%',
    //flexDirection: 'row',
    //backgroundColor: 'yellow'
  },
  bar: {
    width: '100%',
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 3
    //backgroundColor: 'yellow'
  },
  sendButton: {
    padding: 5
  }
});