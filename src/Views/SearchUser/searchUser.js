import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { HeaderHeightContext } from "@react-navigation/stack";
//import Toast from 'react-native-simple-toast';
import { Ionicons } from '@expo/vector-icons';

import { GREY_GREEN } from '../../constants/colors';

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
    this.searchForUser(this.state.searchText);
  }

  hanleSearchSubmit (searchText) {
    console.log('submitted search ' + searchText);
    this.searchForUser(searchText);
  }

  searchForUser (spotifyUserID) {
    this.props.fetchSearchUser(spotifyUserID);
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
      //if (Toast) { Toast.showWithGravity('Please enter a playlist name', Toast.SHORT, Toast.CENTER); }
      return;
    }
    this.setState({ namePlaylistModalView: false });
    console.log(      
      this.props.userID,
      this.props.spotifyUserID,
      [this.props.searchState.userSearchStringID.trim().toLowerCase()],
      playlistName,
      this.props.tokenData);
    this.props.createGroup(
      this.props.userID,
      this.props.spotifyUserID,
      [this.props.searchState.userSearchStringID.trim().toLowerCase()],
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
      const userData = searchState.userData;
      const userImageUrl = userData && Array.isArray(userData.images) && userData.images.length > 0 && userData.images[0].url ?
        userData.images[0].url : null;

      const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0

      searchFeedback = (
        <HeaderHeightContext.Consumer>
          {headerHeight => (
            <KeyboardAvoidingView 
              {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
              //behavior={Platform.OS == "ios" ? "padding" : "height"}
              keyboardVerticalOffset={headerHeight + keyboardVerticalOffset}
            >
              <View style={styles.foundUserView}>
                <Text>Found user: {searchState.userSearchStringID}</Text>
                <Text style={styles.userDisplayName}>{userData.display_name}</Text>
                {userImageUrl ? 
                  <Image
                    style={styles.userImage}
                    source={{uri: userImageUrl}}/> :
                  <Ionicons name='ios-contact' size={150} color='grey' />
                }
                <StartChatButton
                  onPress={() => this.handleStartChatButtonClick()}
                />
              </View>
            </KeyboardAvoidingView>
          )}
        </HeaderHeightContext.Consumer>
      );
    }
    else {
      searchFeedback = (<Text></Text>);
    }

    return (
      <View style={styles.searchUserPage}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => this.handleSearchUserClick()}>
            <Ionicons color='grey' name='md-search' size={30} />
          </TouchableOpacity>
          <TextInput 
            style={styles.searchUserTextInput} 
            onChangeText={text => this.setState({ searchText: text })}
            placeholder='Enter a spotify user ID'
            returnKeyType='search'
            onSubmitEditing={searchEvent => this.hanleSearchSubmit(searchEvent.nativeEvent.text)}
          />
        </View>

        {/* <Button 
          title='Search'
          onPress={() => this.handleSearchUserClick()}
        /> */}
        <View style={styles.container}>
          {searchFeedback}
        </View>
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
    flex: 1,
    height: 40,
    //borderColor: 'gray',
    //borderWidth: 1
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREY_GREEN
  },
  searchIconButton: {
    margin: 8
  },
  foundUserView: {
    flex: .75,
    //height: 300,
    flexDirection: 'column',
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
  userImage: {
    width: 150, 
    height: 150
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);