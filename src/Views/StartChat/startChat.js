import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { HeaderHeightContext } from "@react-navigation/elements";

import SearchForUserBar from '../../Components/SearchForUserBar';
import UserInfo from '../../Components/UserInfo';
import FriendsList from '../../Components/FriendsList';
import UsersInGroup from '../../Components/UsersInGroup';

import { searchUser } from '../../api/spotify/user';
import { spotifyUserToSsUser } from '../../api/transform';

import { 
  selectSuggestedUsers,
  selectSuggestedUsersMap,
} from '../../reducers/friendReducer';

import { GREY_GREEN, LIGHT_GREEN, DARK_GREEN } from '../../constants/colors';

class StartChat extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      searchUserInputText: '',
      searchedSpotifyUserID: '',
      searchingForUser: false,
      searchedUser: null,
      userFound: false,
      searchingForUser: false,
      errorSearchingForUser: false,
      usersInGroup: [],
      spotifyUserIdsInGroupSet: new Set(),
    };
  }

  componentDidMount () {
    this.props.navigation.setOptions({
      title: 'Start Chat',
      headerTitleAlign: 'center',
    });
  }

  componentWillUnmount() {
  }

  async handleSearchForUser() {

    const searchText = this.state.searchUserInputText;
    try {
      this.setState({ 
        searchedUser: null,
        userFound: false,
        searchingForUser: true, 
        errorSearchingForUser: false,
        searchedSpotifyUserID: searchText,
      });
      console.log('searching for user: ' + searchText);
      const user = await searchUser(searchText);
      console.log("FOUND USER: ", user);
      if (!user) {
        this.setState({ searchingForUser: false, userFound: false, searchedUser: null });
      }
      else {
        this.setState({ searchingForUser: false, userFound: true, searchedUser: spotifyUserToSsUser(user) });
      }
    }
    catch (error) {
      console.error("Error searching for user: ", error);
      this.setState({ errorSearchingForUser: true });
    }
  }

  handleOnSearchTextChanged(text) {
    console.log("text changed: " + text);
    this.setState({ searchUserInputText: text });
  }

  handleClearSearchText() {
    console.log("clearing search text");
    this.setState({ 
      searchUserInputText: '',
      searchedSpotifyUserID: '',
    });
  }

  handleFriendsListItemPressed(spotifyUserID) {
    this.setState({ 
      searchedSpotifyUserID: spotifyUserID,
      searchUserInputText: spotifyUserID,
      userFound: true,
      searchedUser: this.props.suggestedUsersMap.get(spotifyUserID).user,
    });
  }

  handleUserAddToGroupButtonPress() {
    const { searchedUser, usersInGroup, spotifyUserIdsInGroupSet } = this.state;
    const { spotifyUserID } = searchedUser;
    if (spotifyUserIdsInGroupSet.has(spotifyUserID)) {
      // TODO: add a toast here?
      console.log("user already in group");
    }
    else {
      const newUsersInGroup = usersInGroup.concat([searchedUser]);
      const newSpotifyUserIdsInGroupSet = new Set(spotifyUserIdsInGroupSet.add(spotifyUserID));
      this.setState({
        usersInGroup: newUsersInGroup,
        spotifyUserIdsInGroupSet: newSpotifyUserIdsInGroupSet, 
      });
    }
    this.setState({
      searchedUser: null,
      userFound: false,
      searchUserInputText: '',
      errorSearchingForUser: false,
      searchedSpotifyUserID: '',
    });
  }

  handleRemoveUserFromStartChatList(userToRemove) {
    console.log("removing user: " + userToRemove.spotifyUserID);
    
    const newValues = this.state.usersInGroup.reduce((result, user) => {
      if (user.spotifyUserID !== userToRemove.spotifyUserID) {
        result.arr.push(user);
        result.set.add(user.spotifyUserID);
      }
      return result;
    }, { arr: [], set: new Set() });

    this.setState({ 
      usersInGroup: newValues.arr,
      spotifyUserIdsInGroupSet: newValues.set,
    });
  }

  render () {

    const theme = this.props.route.params.theme;
    const _styles = getStyles(theme);

    const {
      searchedSpotifyUserID, 
      searchedUser, 
      searchingForUser, 
      searchUserInputText,
      errorSearchingForUser,
    } = this.state

    let body;
    if (errorSearchingForUser) {
      body = (
        <Text style={_styles.text}>
          Error searching for user {searchUserInputText}
        </Text>);
    }
    else if (!searchingForUser && searchedSpotifyUserID && !searchedUser) {
      body = (
        <Text style={_styles.text}>
          Could not find user: {searchUserInputText}
        </Text>);
    }
    else if (searchedSpotifyUserID && searchedUser) {
      const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0
      body = (
        <View style={styles.searchedUserView}>
          <HeaderHeightContext.Consumer>
            {headerHeight => (
              <KeyboardAvoidingView
                {...(Platform.OS === "ios" ? { behavior: "padding" } : {})}
                keyboardVerticalOffset={headerHeight + keyboardVerticalOffset}
              >
                <UserInfo
                  style={styles.userInfo}
                  displayName={this.state.searchedUser.displayName}
                  spotifyUserID={this.state.searchedUser.spotifyUserID}
                  imageUrl={this.state.searchedUser.imageUrl}
                />
              </KeyboardAvoidingView>
            )}
          </HeaderHeightContext.Consumer>
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.addToGroupButton}
              onPress={() => this.handleUserAddToGroupButtonPress()}>
              <Text style={{ fontSize: 20 }}>Add To Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else {
      // const { usersInGroup } = this.state;
      body = (
        <View style={styles.friendsListView}>
          {/* {usersInGroup.length > 0 && 
            <UsersInGroup users={usersInGroup} />
          } */}
          {this.props.suggestedUsers && this.props.suggestedUsers.length > 0 &&
            <FriendsList
              friends={this.props.suggestedUsers}
              //onEndReached={() => console.log("friends list end reached")}
              onItemPressed={spotifyUserID => this.handleFriendsListItemPressed(spotifyUserID)}
              style={styles.friendsList}
            />}
        </View>
      );
    }

    const { usersInGroup } = this.state;
    return (
      <View style={styles.startChatPage}>
        <SearchForUserBar
          text={this.state.searchUserInputText}
          handleSearchClick={() => this.handleSearchForUser()}
          textChanged={text => this.handleOnSearchTextChanged(text)}
          placeholderText='Enter a Spotify User ID'
          handleSearchSubmit={_text => this.handleSearchForUser()}
          clearText={() => this.handleClearSearchText()}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.mainBody}>
            {usersInGroup.length > 0 && 
              <UsersInGroup 
                users={usersInGroup}
                onRemoveUserFromStartChatList={user => 
                  this.handleRemoveUserFromStartChatList(user)}
              />
            }
            {body}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

};

const mapStateToProps = (state) => {

  const suggestedUsers = selectSuggestedUsers(state);
  return {
    suggestedUsers: suggestedUsers,
    suggestedUsersMap: selectSuggestedUsersMap(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const getStyles = (theme) => {
  return {
    text: {
      color: theme.colors.text,
    },
  };
};

const styles = StyleSheet.create({
  startChatPage: {
    flex: 1,
  },
  mainBody: {
    flex: 1,
  },
  friendsListView: {
    flex: 1,
    width: '100%'
  },
  friendsList: {
    //backgroundColor: 'blue',
    // width: '100%',
  },
  searchedUserView: {
    flex: 1,
    //backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  userInfo: {
    //flex: .75,
    //backgroundColor: 'blue',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSection: {
    //flex: .25,
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addToGroupButton: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    height: 60,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StartChat);