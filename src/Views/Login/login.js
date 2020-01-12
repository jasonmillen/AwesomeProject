import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import { 
  login,
  completeLoginProcess
} from '../../actions/userActions';
import { 
  selectUserID,
  selectIsProcessingLogin
} from '../../reducers/userReducer';
import { navigateAndResetStack } from '../../utility/navigation';

class Login extends React.Component {

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    console.log(this.props.userID);

    if (this.props.userID) {
      this.props.navigation.navigate('Home');
      return;
    }
  }

  async componentDidUpdate() {
    console.log(this.props.userID);

    if (this.props.userID) {
      this.navigateToHomeScreen();
      this.props.completeLoginProcess();
    }
  }

  navigateToHomeScreen() {
    navigateAndResetStack(this.props.navigation, 'Home');
  }

  handleLogin() {
    //this.props.navigation.navigate('Home');
    // TEMP DISABLED FOR QUICKER TESTING
    this.props.login();
  }

  render() {
    return (
      <View style={styles.loginPage}>
        {!this.props.isProcessingLogin && //!this.props.userID &&
        <TouchableOpacity
          onPress={()=>this.handleLogin()}>
            <Text style={styles.loginButton}>Login With Spotify</Text>
        </TouchableOpacity>
        }
      </View>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state),
    isProcessingLogin: selectIsProcessingLogin(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => {
      dispatch(login());
    },
    completeLoginProcess: () => {
      dispatch(completeLoginProcess());
    }
  };
}

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    fontSize: 20,
    color: 'green'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);