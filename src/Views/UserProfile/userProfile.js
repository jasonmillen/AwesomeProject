import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import LogoutButton from '../../Components/LogoutButton';
import {
  fetchLogout
} from '../../actions/userActions';
import { 
  selectSpotifyUserID,
  selectLogoutSuccess,
  selectUser
} from '../../reducers/userReducer';
import { navigateAndResetStack } from '../../utility/navigation'; 

import { DARK_GREEN, GREY_GREEN, LIGHT_GREEN } from '../../constants/colors';

class UserProfile extends React.Component {

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

    const user = this.props.user;

    if (!this.props.user) {
      return <View></View>
    }
    const userImageUrl = user.imageUrl;

    return (
      <View style={styles.profilePage}>
        {user && user.displayName && <Text style={styles.userDisplayNameText}>{this.props.user.displayName}</Text>}
        <View style={styles.userImageSpotifyUserIdView}>
          {userImageUrl ? 
            <Image
              style={styles.userImage}
              source={{uri: userImageUrl}}/> :
            <Ionicons name='ios-contact' size={150} color='grey' />
          }
          <Text>Logged in as {this.props.spotifyUserID}</Text>
        </View>
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
    logoutSuccess: selectLogoutSuccess(state),
    user: selectUser(state)
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
    margin: 35,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    height: 60,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  userDisplayNameText: {
    fontSize: 30,
    color: DARK_GREEN
  },
  userImage: {
    borderRadius: 15,
    marginTop: 12,
    marginBottom: 4,
    width: 170, 
    height: 170
  },
  userImageSpotifyUserIdView: {
    alignItems: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);