import React, { Component } from 'react';
import { Button } from 'react-native';

export default (props) => {
  return (
    <Button
      title='Log In'
      onPress={() => props.onPress()}
    />
  );
};
