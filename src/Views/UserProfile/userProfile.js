import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import LogoutButton from '../../Components/LogoutButton';
import {
  fetchLogout
} from '../../actions/userActions';
import { 
  selectSpotifyUserID,
  selectLogoutSuccess
} from '../../reducers/userReducer';
import { navigateAndResetStack } from '../../utility/navigation'; 

class UserProfile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile'
    }
  };

  componentDidUpdate () {
    if (this.props.logoutSuccess) {
      this.navigateToLoginScreen();
    }
  }

  navigateToLoginScreen () {
    navigateAndResetStack(this.props.navigation, 'Login');
  }

  handleLogoutButtonPress () {
    this.props.fetchLogout();
  }


  render() {
    return (
      <View style={styles.profilePage}>
        <Text>Profile Page</Text>
        <Text>Logged in as {this.props.spotifyUserID}</Text>
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
    spotifyUserID: selectSpotifyUserID(state),
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