import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { Linking } from 'expo';

import ViewPlaylistOnSpotifyButton from '../../Components/ViewPlaylistOnSpotifyButton';
import SearchSongButton from '../../Components/SearchSongButton';
import MessageList from '../../Components/MessageList';

import { fetchMessagesGetForGroup } from '../../actions/messageActions';

import { selectUserID, selectUsersByID } from '../../reducers/userReducer';
import { selectSelectedGroup } from '../../reducers/groupReduer';
import { 
  selectMessagesForGroup,
  selectMessagesGetForGroupError,
  selectMessagesGetForGroupSuccess
} from '../../reducers/messageReducer';

class Group extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const groupID = navigation.getParam('groupID');
    const playlistName = navigation.getParam('playlistName');
    return {
      title: playlistName ? playlistName : `Group ${groupID}`,
      headerRight: () => (
        <View style={styles.titleBarRightButtonView}>
          <SearchSongButton
            style={styles.searchSongButton}
            onPress={() => navigation.getParam('handleSearchSongButtonPress')(navigation)}
          />
          <ViewPlaylistOnSpotifyButton
            style={styles.viewPlaylistOnSpotifyButton}
            onPress={() => navigation.getParam('handleViewPlaylistOnSpotifyButtonPress')()}
          />
        </View>
      )

    };
  };

  constructor(props) {
    super(props);

    this.handleViewPlaylistOnSpotifyButtonPress = this.handleViewPlaylistOnSpotifyButtonPress.bind(this);
    this.handleSearchSongButtonPress = this.handleSearchSongButtonPress.bind(this);

    props.navigation.setParams({
      handleViewPlaylistOnSpotifyButtonPress: this.handleViewPlaylistOnSpotifyButtonPress,
      handleSearchSongButtonPress: this.handleSearchSongButtonPress
    });
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

    return (
      <View style={styles.groupPage}>
        {messageComponent}
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
  return {
    selectedGroup,
    messages,
    messagesGetForGroupError,
    messagesGetForGroupSuccess,
    userID,
    usersByID
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
    flexDirection: 'row'
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
    marginTop: 10,
    width: '100%'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);