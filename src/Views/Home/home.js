import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import ViewProfileButton from '../../Components/ViewProfileButton';
import StartChatButton from '../../Components/StartChatButton';
import SearchSongButton from '../../Components/SearchSongButton';
import { selectUserID } from '../../reducers/userReducer';

class Home extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chats',
      headerRight: () => (
        <View style={styles.titleBarRightButtonView}>
          <SearchSongButton
            style={styles.searchSongButton}
            onPress={() => navigation.getParam('handleSearchSongButtonPress')(navigation)}
          />
          <StartChatButton
            style={styles.startChatButton}
            onPress={() => navigation.getParam('handleStartChatButtonPress')(navigation)}
          />
        </View>
      ),
      headerLeft: () => (
        <ViewProfileButton
          style={styles.viewProfileButton}
          onPress={() => navigation.getParam('handleViewProfileButtonPress')(navigation)}
        />
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleViewProfileButtonPress: this.handleViewProfileButtonPress,
      handleStartChatButtonPress: this.handleStartChatButtonPress,
      handleSearchSongButtonPress: this.handleSearchSongButtonPress
    })
  }

  handleViewProfileButtonPress(navigation) {
    navigation.navigate('UserProfile');
  }

  handleSearchSongButtonPress(navigation) {
    navigation.navigate('SearchSong');
  }

  handleStartChatButtonPress(navigation) {
    navigation.navigate('SearchUser');
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
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const styles = StyleSheet.create({
  homePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleBarRightButtonView: {
    flex: 1,
    flexDirection: 'row'
  },
  viewProfileButton: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  startChatButton: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10
  },
  searchSongButton: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);