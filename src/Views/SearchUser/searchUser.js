import React from 'react';
import { Keyboard } from 'react-native';
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
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { HeaderHeightContext } from "@react-navigation/elements";
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking'

import { GREY_GREEN, LIGHT_GREEN, DARK_GREEN } from '../../constants/colors';

import FriendsList from '../../Components/FriendsList';
import StartChatButton from '../../Components/StartChatButton';
import NamePlaylistModal from '../../Components/NamePlaylistModal';

import {
  fetchSearchUser,
  searchClearResults,
} from '../../actions/searchActions';
import { fetchCreateGroup } from '../../actions/groupActions';

import {
  selectUserID,
  selectUsersByID,
  selectSpotifyUserID,
  selectTokenData
} from '../../reducers/userReducer';

import {
  selectUserSearchState
} from '../../reducers/searchReducer';

import { 
  selectFriends,
  selectSuggestedUsers,
} from '../../reducers/friendReducer';

class SearchUser extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      searchText: '',
      namePlaylistModalView: false
    };
  }

  componentDidMount () {
    this.props.navigation.setOptions({
      title: 'Search For User',
      headerTitleAlign: 'center',
    });
  }

  componentWillUnmount() {
    this.props.searchClearResults();
  }

  handleSearchUserClick () {
    console.log('clicked search');
    console.log(this.props.tokenData);
    this.searchForUser(this.state.searchText);
  }

  handleSearchSubmit (searchText) {
    console.log('submitted search ' + searchText);
    this.searchForUser(searchText);
  }

  handleClearText() {
    this.setState({ searchText: '' });
    this.handleSearchSubmit('');
  }

  handleClickOnFriendInList(spotifyUserID) {
    this.setState({ searchText: spotifyUserID });
    this.handleSearchSubmit(spotifyUserID);
  }

  searchForUser (spotifyUserID) {
    this.props.fetchSearchUser(spotifyUserID);
  }

  handleViewUserButtonClick() {
    const spotifyUserID = this.props.searchState.userData.id;
    console.log(`will navigate to user id: ${spotifyUserID}`);
    try {
      Linking.openURL(`spotify:user:${spotifyUserID}`);
    }
    catch (error) {
      console.log('Error attempting to open user` in spotify: ', error);
    }
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
    const theme = this.props.route.params.theme;
    const _styles = getStyles(theme);

    let searchFeedback;
    let searchState = this.props.searchState;
    if (searchState.searchForUserError) {
      searchFeedback = (<Text style={_styles.errorGettingUserText}>Error searching for user {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID /*&& !searchState.isSearchingForUser*/ && !searchState.userFound) {
      searchFeedback = (<Text style={_styles.noUserFoundText}>Could not find user: {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID && searchState.userFound) {
      const userData = searchState.userData;
      const userImageUrl = userData && Array.isArray(userData.images) && userData.images.length > 0 && userData.images[0].url ?
        userData.images[0].url : null;

      const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0

      searchFeedback = (
        <View>
          <HeaderHeightContext.Consumer>
            {headerHeight => (
              <KeyboardAvoidingView 
                {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
                //behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={headerHeight + keyboardVerticalOffset}
              >
                <View style={styles.foundUserView}>
                  <Text style={styles.userDisplayName}>{userData.display_name}</Text>
                  {userImageUrl ? 
                    <Image
                      style={styles.userImage}
                      source={{uri: userImageUrl}}/> :
                    <FontAwesome name='user-circle' size={150} color='grey' />
                  }
                  <Text style={_styles.spotifyUserIdText}>Spotify User ID: {searchState.userSearchStringID}</Text>
                </View>
              </KeyboardAvoidingView>
            )}
          </HeaderHeightContext.Consumer>
          <View style={styles.startChatSection}>
            <TouchableOpacity 
              style={styles.viewUserButton}
              onPress={() => this.handleViewUserButtonClick()}>
              <Text style={{ fontSize: 20 }}>View User</Text>
            </TouchableOpacity>
            <StartChatButton
              style={styles.startChatButton}
              onPress={() => this.handleStartChatButtonClick()}
            />
          </View>
        </View>

      );
    }
    else if (this.props.friends && this.props.friends.length > 0) {
      searchFeedback = (
        <FriendsList
          friends={this.props.friends}
          onEndReached={() => {console.log("friends list end reached")}}
          onItemPressed={spotifyUserID => this.handleClickOnFriendInList(spotifyUserID)}
          style={styles.friendsList}
        />);
      // const friend = this.props.friends[0];
      // const uri = friend.user.imageUrl;
      // console.log(friend);
      // searchFeedback = (
      //   <View>
      //     <Text>{friend.user.displayName}</Text>
      //     {uri && <Image style={styles.userImage} source={{uri}} />}
      //   </View>
      // );
    }
    else {
      searchFeedback = (<Text></Text>);
    }

    return (
      <View style={_styles.searchUserPage}>
        <View style={_styles.searchBar}>
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => this.handleSearchUserClick()}>
            <Ionicons color='grey' name='md-search' size={30} />
          </TouchableOpacity>
          <TextInput 
            style={_styles.searchUserTextInput} 
            value={this.state.searchText}
            onChangeText={text => this.setState({ searchText: text })}
            placeholder='Enter a spotify user ID'
            placeholderTextColor={theme.colors.textInputPlaceholder}
            returnKeyType='search'
            onSubmitEditing={searchEvent => this.handleSearchSubmit(searchEvent.nativeEvent.text)}
          />
          {!!this.state.searchText && <TouchableOpacity
            style={styles.clearTextButton}
            onPress={() => this.handleClearText()}>
            <MaterialIcons color='grey' name='clear' size={30} />
          </TouchableOpacity>}
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {searchFeedback}
          </View>
        </TouchableWithoutFeedback>
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

  // console.log("STATE TO PROPS");
  // const suggestedUsers = selectSuggestedUsers(state);
  // console.log("u: ", suggestedUsers);
  // console.log("===== done");

  // const spotifyUserID = selectSpotifyUserID(state);
  // let friends = selectFriends(state);
  // const usersByID = selectUsersByID(state);

  // // console.log('FRIENDS: ', friends);
  // // console.log('USERS BY ID: ', usersByID);

  // const friendScores = new Map();
  // friends.forEach((value, key) => {
  //   let min = Number.MAX_SAFE_INTEGER;
  //   value.playlists.forEach(playlist => {
  //     if (playlist.followers < min) {
  //       min = playlist.followers;
  //     }
  //   });
  //   min = Math.max(min, 1); // prevent min value of 0

  //   // playlists with less followers have higher score
  //   friendScores.set(key, { user: value.user, score: (1 / min) });
  // });
  // for (const [key, value] of Object.entries(usersByID)) {
  //   if (!value.spotifyUserID) {
  //     continue;
  //   }
  //   if (friendScores.has(value.spotifyUserID)) {
  //     friendScores.get(value.spotifyUserID).score += 1;
  //   }
  //   else {
  //     friendScores.set(value.spotifyUserID, { user: value, score: 1 });
  //   }
  // }
  // const friendScoresArray = [];
  // friendScores.forEach((value, key) => {
  //   if (key !== spotifyUserID) {
  //     friendScoresArray.push({ spotifyUserID: key, user: value.user, score: value.score });
  //   }
  // });
  // friendScoresArray.sort((a, b) => b.score - a.score);

  //console.log("FRIEND SCORES: ", friendScoresArray);

  const suggestedUsers = selectSuggestedUsers(state);

  return {
    tokenData: selectTokenData(state),
    searchState: selectUserSearchState(state),
    userID: selectUserID(state),
    spotifyUserID: selectSpotifyUserID(state),
    friends: suggestedUsers,// friendScoresArray,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSearchUser: (spotifyUserID) => {
      dispatch(fetchSearchUser(spotifyUserID));
    },
    createGroup: (creatorID, creatorSpotifyID, memberSpotifyIDs, playlistName, tokenData) => {
      dispatch(fetchCreateGroup(creatorID, creatorSpotifyID, memberSpotifyIDs, playlistName, tokenData));
    },
    searchClearResults: () => {
      dispatch(searchClearResults());
    },
  };
};

const getStyles = (theme) => {
  return {
    searchUserPage: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      backgroundColor: theme.colors.backgroundColor,
      //margin: 10,
      //marginTop: 10
    },
    searchUserTextInput: {
      flex: 1,
      height: 40,
      color: theme.colors.text,
      //borderColor: 'gray',
      //borderWidth: 1
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      //backgroundColor: GREY_GREEN
      backgroundColor: theme.colors.textInputBackground,
    },
    spotifyUserIdText: {
      color: theme.colors.text,
    },
    errorGettingUserText: {
      color: theme.colors.text,
    },
    noUserFoundText: {
      color: theme.colors.text,
    },
  };
};

const styles = StyleSheet.create({
  // searchUserPage: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'stretch',
  //   justifyContent: 'flex-start',
  //   //margin: 10,
  //   //marginTop: 10
  // },
  // searchUserTextInput: {
  //   flex: 1,
  //   height: 40,
  //   //backgroundColor: 'yellow',
  //   //borderColor: 'gray',
  //   //borderWidth: 1
  // },
  userDisplayName: {
    fontSize: 30,
    color: DARK_GREEN
  },
  // spotifyUserIdText: {
  //   //fontSize: 
  //   //color: 'grey'
  // },
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
  // searchBar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: GREY_GREEN
  // },
  searchIconButton: {
    margin: 8
  },
  clearTextButton: {
    margin: 8
  },
  foundUserView: {
    flex: .75,
    //height: 300,
    flexDirection: 'column',
    //backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'grey'
  },
  userImage: {
    borderRadius: 15,
    marginTop: 12,
    marginBottom: 4,
    width: 170, 
    height: 170
  },
  startChatSection: {
    flex: 0.2,
    flexDirection: 'row',
    //backgroundColor: 'green'
  },
  startChatButton: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    height: 60,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  viewUserButton: {
    backgroundColor: GREY_GREEN,
    borderRadius: 10,
    height: 60,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  friendsList: {
    width: '100%',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);

// function SearchUser(props) {
//   const theme = useTheme();

//   return <SearchUserClass {...props} theme={theme} />;
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);