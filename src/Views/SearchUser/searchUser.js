import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Image,
  StyleSheet
} from 'react-native';
import Toast from 'react-native-simple-toast';

import StartChatButton from '../../Components/StartChatButton';
import NamePlaylistModal from '../../Components/NamePlaylistModal';

import {
  fetchSearchUser
} from '../../actions/searchActions';
import { fetchCreateGroup } from '../../actions/groupActions';

import {
  selectUserID,
  selectSpotifyUserID,
  selectTokenData
} from '../../reducers/userReducer';

import {
  selectUserSearchState
} from '../../reducers/searchReducer';

class SearchUser extends React.Component {

  static navigationOptions = {
    title: 'Search For Users'
  };

  constructor (props) {
    super (props);

    this.state = {
      searchText: '',
      namePlaylistModalView: false
    };
  }

  handleSearchUserClick () {
    console.log('clicked search');
    console.log(this.props.tokenData);
    this.props.fetchSearchUser(this.state.searchText);
  }


  handleStartChatButtonClick () {
    this.setState({ namePlaylistModalView: true });
  }

  onNamePlaylistModalCancel () {
    this.setState({ namePlaylistModalView: false });
  }

  onNamePlaylistModalOK (playlistName) {
    console.log('playlist name:', playlistName);
    if (playlistName.trim().length <= 0) {
      console.log('cannot have empty playlist name');
      Toast.showWithGravity('Please enter a playlist name', Toast.SHORT, Toast.CENTER);
      return;
    }
    this.setState({ namePlaylistModalView: false });
    console.log(      
      this.props.userID,
      this.props.spotifyUserID,
      [this.props.searchState.userSearchStringID],
      playlistName,
      this.props.tokenData);
    this.props.createGroup(
      this.props.userID,
      this.props.spotifyUserID,
      [this.props.searchState.userSearchStringID],
      playlistName,
      this.props.tokenData);
  }

  render () {
    let searchFeedback;
    let searchState = this.props.searchState;
    if (searchState.searchForUserError) {
      searchFeedback = (<Text>Error searching for user {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID && !searchState.isSearchingForUser && !searchState.userFound) {
      searchFeedback = (<Text>Could not find user: {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID && searchState.userFound) {
      userData = searchState.userData;
      searchFeedback = (
        <View>
          <Text>Found user: {searchState.userSearchStringID}</Text>
          <Text style={styles.userDisplayName}>{userData.display_name}</Text>
          {
            (userData && Array.isArray(userData.images) && userData.images.length > 0 && userData.images[0].url) && 
            <Image
              style={{width: 200, height: 200}}
              source={{uri: userData.images[0].url}}
            />
          }
          <StartChatButton
            onPress={() => this.handleStartChatButtonClick()}
          />
        </View>
      );
    }
    else {
      searchFeedback = (<Text></Text>);
    }

    return (
      <View style={styles.searchUserPage}>
        <TextInput 
          style={styles.searchUserTextInput} 
          onChangeText={text => this.setState({ searchText: text })}
          placeholder='Enter a spotify user ID'
        />

        <Button 
          title='Search'
          onPress={() => this.handleSearchUserClick()}
        />
        {searchFeedback}
        <NamePlaylistModal
          style={styles.modal}
          visible={this.state.namePlaylistModalView}
          onOK={(playlistName) => this.onNamePlaylistModalOK(playlistName)}
          onCancel={() => this.onNamePlaylistModalCancel()}
        />
      </View>
    )
  }

};

const mapStateToProps = (state) => {
  return {
    tokenData: selectTokenData(state),
    searchState: selectUserSearchState(state),
    userID: selectUserID(state),
    spotifyUserID: selectSpotifyUserID(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSearchUser: (spotifyUserID) => {
      dispatch(fetchSearchUser(spotifyUserID));
    },
    createGroup: (creatorID, creatorSpotifyID, memberSpotifyIDs, playlistName, tokenData) => {
      dispatch(fetchCreateGroup(creatorID, creatorSpotifyID, memberSpotifyIDs, playlistName, tokenData));
    }
  };
};

const styles = StyleSheet.create({
  searchUserPage: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 10,
    marginTop: 10
  },
  searchUserTextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  userDisplayName: {
    fontSize: 20,
    color: 'blue'
  },
  startChatButton: {
    marginTop: 10
  },
  modal: {
    flex: 1,
    width: 200,
    height: 200,
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);