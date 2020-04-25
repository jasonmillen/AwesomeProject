import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

import {
  IP
} from '../../../config';

import GroupList from '../../Components/GroupList';

import ViewProfileButton from '../../Components/ViewProfileButton';
import SearchUserHeaderButton from '../../Components/SearchUserHeaderButton';
import SearchSongButton from '../../Components/SearchSongButton';
import { 
  selectSpotifyUserID,
  selectUserID,
  selectUser,
  selectTokenData
} from '../../reducers/userReducer';

import { 
  selectUserGetGroupsError,
  selectUserGetGroupsSuccess,
  selectGroups,
  selectSelectedGroupID
 } from '../../reducers/groupReduer';

import { 
  fetchUserGetGroups,
  groupSelect
 } from '../../actions/groupActions';
//import token from '../../api/spotify/token';

class Home extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('displayName') || navigation.getParam('spotifyUserID'),
      headerRight: () => (
        <View style={styles.titleBarRightButtonView}>
          <SearchSongButton
            style={styles.searchSongButton}
            onPress={() => navigation.getParam('handleSearchSongButtonPress')(navigation)}
          />
          <SearchUserHeaderButton
            style={styles.searchUserHeaderButton}
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

  constructor(props) {
    super(props);

    props.navigation.setParams({
      spotifyUserID: this.props.spotifyUserID,
      displayName: this.props.user.displayName,
      handleViewProfileButtonPress: this.handleViewProfileButtonPress,
      handleStartChatButtonPress: this.handleStartChatButtonPress,
      handleSearchSongButtonPress: this.handleSearchSongButtonPress
    });

    // const sock = new SockJS(`http://${IP}:3000/songsharesvc`);
    // const stompClient = Stomp.over(sock);

    this.state = {
      groups: [],
      // sock,
      // stompClient
    };

    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onError = this.onError.bind(this);
    this.onConnected = this.onConnected.bind(this);

  }

  onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    console.log('MESSAGE PAYLOAD: ', message);
  }

  onError(error) {
    console.log('WEBSOCKET ERROR: ', error);
  }

  onConnected() {
    const stompClient = this.state.stompClient;

        // Subscribe to the Public Topic
        stompClient.subscribe('/topic/public', onMessageReceived);

        // Tell your username to the server
        stompClient.send("/app/chat.register",
            {},
            JSON.stringify({sender: 'blah', type: 'JOIN'})
        );

  }

  componentDidMount() {
    this.props.getGroupsForUser(this.props.userID, this.props.tokenData);

    //this.state.stompClient.connect({}, this.onConnected, this.onError);

    // console.log('SOCKET SETUP');
    // this.state.socket.onopen = () => this.state.socket.send(JSON.stringify({type: 'greet', payload: 'Hello Mr. Server!'}));
    // this.state.socket.onmessage = ({data}) => console.log('SOCKET DATA: ', data);

    // const sock = new SockJS(`http://${IP}:3000/songsharesvc`);
    // const stompClient = Stomp.over(sock);
    // stompClient.connect({}, 
    //   () => {
    //     stompClient.subscribe('/topic/public')

    //   }
    // )

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

  handleGroupListEndReached() {
    console.log('Group list end reached!');
  }

  handleGroupListItemPressed(group) {
    console.log('Pressed group: ' + group.playlistID)
    this.props.selectGroup(group.id);
    this.props.navigation.navigate('Group', { groupID: group.id, playlistName: group.playlistName });
  }

  render() {

    if (this.props.userGetGroupsError) {
      return (
        <View>
          <Text>Error getting groups. Please try again later.</Text>
        </View>
      );
    }

    if (!this.props.userGetGroupsSuccess) {
      return (
        <View>
        </View>
      );
    }

    return (
      <View style={styles.homePage}>
        <Text>Total num of groups is {this.props.groups.length}</Text>
        <GroupList
          groups={this.props.groups}
          onEndReached={() => this.handleGroupListEndReached()}
          onItemPressed={(group) => this.handleGroupListItemPressed(group)}
        /> 
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  const userID = selectUserID(state);
  const user = selectUser(state);
  return {
    spotifyUserID: selectSpotifyUserID(state),
    userID,
    user,
    groups: selectGroups(state),
    tokenData: selectTokenData(state),
    userGetGroupsError: selectUserGetGroupsError(state),
    userGetGroupsSuccess: selectUserGetGroupsSuccess(state),
    selectedGroupID: selectSelectedGroupID(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupsForUser: (userID, tokenData) => {
      dispatch (fetchUserGetGroups(userID, tokenData));
    },
    selectGroup: (groupID) => {
      dispatch (groupSelect(groupID));
    }
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
    marginLeft: 15,
    marginRight: 15
  },
  searchUserHeaderButton: {
    flex: 1,
    marginRight: 20,
    marginLeft: 10
  },
  searchSongButton: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);