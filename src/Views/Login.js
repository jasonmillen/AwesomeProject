import React, { Component } from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';
import { connect } from 'react-redux';

import { 
  getLoggedInUser,
  login
} from '../actions/userActions';
import { selectUserID } from '../reducers/userReducer';

class Login extends React.Component {

  static navigationOptions = {
    title: 'Login'
  };

  async componentDidMount() {
    console.log(this.props.userID);
    this.props.fetchUser();
  }

  async componentDidUpdate() {
    console.log(this.props.userID);

  }

  handleLogin() {
    this.props.login();
  }

  render() {
    return (
      <View>
        <Button
          title='Login'
          onPress={()=>this.handleLogin()} />
      </View>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => {
      dispatch(getLoggedInUser());
    },
    login: () => {
      dispatch(login())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);