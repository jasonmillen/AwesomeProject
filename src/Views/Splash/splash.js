import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import { 
  getLoggedInUser
} from '../../actions/userActions';
import { 
  selectUserID,
  selectGetLoggedInUserSuccess
 } from '../../reducers/userReducer';
 import { navigateAndResetStack } from '../../utility/navigation';

class Splash extends React.Component {

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    console.log(this.props.userID);

    if (this.props.userID) {
      this.navigateToHomeScreen();
      return;
    }

    this.props.getLoggedInUser();
  }

  async componentDidUpdate() {
    console.log(this.props.userID);

    if (this.props.getLoggedInUserSuccess) {
      if (this.props.userID) {
        this.navigateToHomeScreen();
      }
      else {
        this.navigateToLoginScreen();
      }
    }
  }

  navigateToHomeScreen() {
    navigateAndResetStack(this.props.navigation, 'Home');
  }

  navigateToLoginScreen() {
    navigateAndResetStack(this.props.navigation, 'Login');
  }

  render() {
    return (
      <View style={styles.splashPage}>
        <Text style={styles.appTitle}>Song Share</Text>
      </View>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state),
    getLoggedInUserSuccess: selectGetLoggedInUserSuccess(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getLoggedInUser: () => {
      dispatch(getLoggedInUser());
    }
  };
}

const styles = StyleSheet.create({
  splashPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  appTitle: {
    fontSize: 40,
    color: 'white'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);