import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import {
  StackActions,
  NavigationActions
} from 'react-navigation';

import {
  fetchLogout
} from '../../actions/userActions';

import { 
  selectUserID,
  selectLogoutSuccess
 } from '../../reducers/userReducer';

import LogoutButton from '../../Components/LogoutButton';

class UserProfile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile'
    }
  };

  componentDidUpdate () {
    if (this.props.logoutSuccess) {
      this.navigateToLoginScreenAfterLogout();
    }
  }

  navigateToLoginScreenAfterLogout () {
    this.props.navigation.navigate('Login');
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })]
      }));
  }

  handleLogoutButtonPress () {
    this.props.fetchLogout();
  }


  render() {
    return (
      <View style={styles.profilePage}>
        <Text>Profile Page</Text>
        <Text>Logged in as {this.props.userID}</Text>
        <LogoutButton 
          style={styles.logoutButton}
          onPress={() => this.handleLogoutButtonPress()}
        />
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state),
    logoutSuccess: selectLogoutSuccess(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLogout: () => {
      dispatch (fetchLogout());
    }
  };
};

const styles = StyleSheet.create({
  profilePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: 'red'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);