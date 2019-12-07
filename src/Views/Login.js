import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export default class Login extends React.Component {

  static navigationOptions = {
    title: 'Login'
  };

  render() {
    return (
      <View>
        <Text>Login Page</Text>
      </View>
    )
  }
};