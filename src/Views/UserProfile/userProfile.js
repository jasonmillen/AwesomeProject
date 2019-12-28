import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import { selectUserID } from '../../reducers/userReducer';

class UserProfile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile'
    }
  };

  render() {
    return (
      <View style={styles.profilePage}>
        <Text>Profile Page</Text>
        <Text>Logged in as {this.props.userID}</Text>
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const styles = StyleSheet.create({
  profilePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);