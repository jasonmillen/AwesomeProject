import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import StartChatButton from '../../Components/StartChatButton';
import { selectUserID } from '../../reducers/userReducer';

class Home extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chats',
      headerRight: () => (
        <StartChatButton
          style={styles.startChatButton}
          onPress={navigation.getParam('handleStartChatButtonPress')}
        />
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleStartChatButtonPress: this.handleStartChatButtonPress
    })
  }

  handleStartChatButtonPress() {
    alert('pressed');
  }

  render() {
    return (
      <View style={styles.homePage}>
        <Text>Home Page</Text>
        <Text>Logged in as {this.props.userID}</Text>
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    userID: selectUserID(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchUser: () => {
    //   dispatch(getLoggedInUser());
    // },
    // login: () => {
    //   dispatch(login())
    // }
  };
}

const styles = StyleSheet.create({
  homePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startChatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: 'yellow',
    paddingRight: 100,
    paddingLeft: 50
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);