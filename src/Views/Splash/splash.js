import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import {
  StackActions,
  NavigationActions
} from 'react-navigation';

import { 
  getLoggedInUser
} from '../../actions/userActions';
import { 
  selectUserID,
  selectGetLoggedInUserSuccess
 } from '../../reducers/userReducer';

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
    this.props.navigation.navigate('Home');
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })]
      }));
  }

  navigateToLoginScreen() {
    this.props.navigation.navigate('Login');
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })]
      }));
  }

  render() {
    return (
      <View style={styles.splashPage}>
        <Text>Splash Screen</Text>
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
    alignItems: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);