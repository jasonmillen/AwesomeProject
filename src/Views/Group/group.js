import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import * as Linking from 'expo-linking'

import ViewPlaylistOnSpotifyButton from '../../Components/ViewPlaylistOnSpotifyButton';
import SearchSongButton from '../../Components/SearchSongButton';
import MessageList from '../../Components/MessageList';

import { fetchMessagesGetForGroup } from '../../actions/messageActions';

import { selectUserID, selectUsersByID } from '../../reducers/userReducer';
import { selectSelectedGroup, selectUsersSearchingForSongsForGroupID } from '../../reducers/groupReduer';
import { 
  selectMessagesForGroup,
  selectMessagesGetForGroupError,
  selectMessagesGetForGroupSuccess
} from '../../reducers/messageReducer';

//import * as socketAPI from '../../actions/socketActions';

class Group extends React.Component {

  constructor(props) {
    super(props);

    this.handleViewPlaylistOnSpotifyButtonPress = this.handleViewPlaylistOnSpotifyButtonPress.bind(this);
    this.handleSearchSongButtonPress = this.handleSearchSongButtonPress.bind(this);

    props.navigation.setOptions({
      title: props.route.params?.playlistName || `Group ${props.params?.groupID}`,
      headerRight: () => (
        <View style={styles.titleBarRightButtonView}>
          <SearchSongButton
            style={styles.searchSongButton}
            onPress={() => this.handleSearchSongButtonPress(props.navigation)}
          />
          <ViewPlaylistOnSpotifyButton
            style={styles.viewPlaylistOnSpotifyButton}
            onPress={() => this.handleViewPlaylistOnSpotifyButtonPress()}
          />
        </View>
      )
    });

    // this.state = {
    //   searchingForSong: false
    // };
  }

  componentDidMount() {
    if (!this.props.selectedGroup) {
      console.error("No selected group when mounting group screen");
      throw new Error("No selected group when mounting group screen");
    }

    if (!this.props.messagesGetForGroupSuccess) {
      this.props.messagesGetForGroup(this.props.selectedGroup.id);
    }
  }

  handleSearchSongButtonPress(navigation) {
    //this.setState({ searchingForSong: true });
    //socketAPI.searchSongStart(this.props.userID, this.props.selectedGroup.id);
    navigation.navigate('SearchSong', { group: this.props.selectedGroup });
  }

  handleViewPlaylistOnSpotifyButtonPress() {
    console.log(`will navigation to playlist id: ${this.props.selectedGroup.playlistID}`);
    try {
      Linking.openURL(`spotify:playlist:${this.props.selectedGroup.playlistID}`);
    }
    catch (error) {
      console.log('Error attempting to open group playlist in spotify: ', error);
    }
  }

  // handleScreenComeIntoFocus() {
  //   if (this.state.searchingForSong) {

  //   }
  // }

  handleMessageListEndReached() {
    console.log('Message list end reached!');
  }

  render() {
    const messages = this.props.messages;
    if (messages) {
      console.log('MESSAGES LENGTH: ', messages.length);
      //console.log('MESSAGES: ', messages);
    }

    let messageComponent;
    if (this.props.userID && this.props.messagesGetForGroupSuccess) {
      if (this.props.messages.length > 0) {
        messageComponent = (
          <MessageList
            messages={this.props.messages}
            userID={this.props.userID}
            usersByID={this.props.usersByID}
            onEndReached={() => this.handleMessageListEndReached()}
            style={styles.messageList} />
        );
      }
      else {
        messageComponent = <Text>No Messages</Text>;
      }
    }

    let usersSearchingComponent = null;
    if (this.props.usersSearchingForSongs && this.props.usersSearchingForSongs.length > 0) {
      usersSearchingComponent = this.props.usersSearchingForSongs.map(userID => {
        const user = this.props.usersByID[userID];
        const displayText = user.displayName ? user.displayName : user.spotifyUserID;
        return <Text key={userID}>{displayText} is searching for songs</Text>;
      });
    }

    return (
      <View style={styles.groupPage}>
        {messageComponent}
        {<View>{usersSearchingComponent}</View>}
        {this.props.messagesGetForGroupError && <Text>Error getting messages. Please try again later.</Text>}
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  const selectedGroup = selectSelectedGroup(state);
  const messages = selectMessagesForGroup(state, selectedGroup.id);
  const messagesGetForGroupError = selectMessagesGetForGroupError(state, selectedGroup.id);
  const messagesGetForGroupSuccess = selectMessagesGetForGroupSuccess(state, selectedGroup.id);
  const userID = selectUserID(state);
  const usersByID = selectUsersByID(state);
  const usersSearchingForSongs = selectUsersSearchingForSongsForGroupID(state, selectedGroup.id);
  return {
    selectedGroup,
    messages,
    messagesGetForGroupError,
    messagesGetForGroupSuccess,
    userID,
    usersByID,
    usersSearchingForSongs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    messagesGetForGroup: (groupID) => {
      dispatch(fetchMessagesGetForGroup(groupID));
    }
  };
};

const styles = StyleSheet.create({
  groupPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleBarRightButtonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewPlaylistOnSpotifyButton: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20
  },
  searchUserHeaderButton: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10
  },
  searchSongButton: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10
  },
  messageList: {
    // marginTop: 10,
    width: '100%',
    marginBottom: 1
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);