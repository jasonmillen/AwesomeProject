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

import { fetchMessagesGetForGroup } from '../../actions/messageActions';

import { selectSelectedGroup } from '../../reducers/groupReduer';
import { selectMessagesForGroup } from '../../reducers/messageReducer';

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

    if (this.props.selectedGroup) {
      this.props.messagesGetForGroup(this.props.selectedGroup.id);
    }
    else {
      console.error("No selected group when mounting group screen");
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

  render() {

    const messages = this.props.messages;

    return (
      <View style={styles.homePage}>
        <Text>Group is: {this.props.selectedGroup.id}</Text>
        {messages &&
        <Text>Group has {this.props.messages.length} messages</Text>
        }
      </View>
    );
  }

};

const mapStateToProps = (state) => {
  const selectedGroup = selectSelectedGroup(state);
  const messages = selectMessagesForGroup(state, selectedGroup.id);
  return {
    selectedGroup,
    messages
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
  homePage: {
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);