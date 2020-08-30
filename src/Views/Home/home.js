import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import GroupList from '../../Components/GroupList';

import ViewProfileButton from '../../Components/ViewProfileButton';
import SearchUserHeaderButton from '../../Components/SearchUserHeaderButton';
// import SearchSongButton from '../../Components/SearchSongButton';
import { 
  selectSpotifyUserID,
  selectUserID,
  selectUser,
  selectUsersByID,
  selectUsersByGroupID,
  selectTokenData
} from '../../reducers/userReducer';

import { 
  selectUserGetGroupsError,
  selectUserGetGroupsSuccess,
  selectGroupsOrderedByLastUpdateTime,
  selectSelectedGroupID,
  selectGroupFollowStatusByID
 } from '../../reducers/groupReduer';

import { 
  fetchUserGetGroups,
  groupSelect,
  groupFollowPlaylist
 } from '../../actions/groupActions';

import { initSocket } from '../../actions/socketActions';
//import token from '../../api/spotify/token';

class Home extends React.Component {

  constructor(props) {
    super(props);

    props.navigation.setOptions({
      title: this.props.user.displayName || this.props.spotifyUserID,
      headerRight: () => (
        <View style={styles.titleBarRightButtonView}>
          <SearchUserHeaderButton
            style={styles.searchUserHeaderButton}
            onPress={() => this.handleStartChatButtonPress(props.navigation)}
          />
        </View>
      ),
      headerLeft: () => (
        <ViewProfileButton
          style={styles.viewProfileButton}
          onPress={() => this.handleViewProfileButtonPress(props.navigation)}
        />
      )
    });

    this.state = {
      groups: [],
    };

  }

  componentDidMount() {
    this.props.getGroupsForUser(this.props.userID, this.props.spotifyUserID);

    console.log('HOME PAGE MOUNTED. USER ID: ' + this.props.userID);
    this.props.initSocket(this.props.userID);
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

  handleFollowPlaylistPressed(group) {
    this.props.followPlaylist(group);
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
        <GroupList
          groups={this.props.groups}
          usersByID={this.props.usersByID}
          usersByGroupID={this.props.usersByGroupID}
          groupFollowStatusByID={this.props.groupFollowStatusByID}
          onEndReached={() => this.handleGroupListEndReached()}
          onItemPressed={(group) => this.handleGroupListItemPressed(group)}
          onFollowPlaylistPressed={(group) => this.handleFollowPlaylistPressed(group)}
          style={styles.groupList}
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
    usersByID: selectUsersByID(state),
    usersByGroupID: selectUsersByGroupID(state),
    groups: selectGroupsOrderedByLastUpdateTime(state),
    tokenData: selectTokenData(state),
    userGetGroupsError: selectUserGetGroupsError(state),
    userGetGroupsSuccess: selectUserGetGroupsSuccess(state),
    selectedGroupID: selectSelectedGroupID(state),
    groupFollowStatusByID: selectGroupFollowStatusByID(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupsForUser: (userID, spotifyUserID) => {
      dispatch (fetchUserGetGroups(userID, spotifyUserID));
    },
    selectGroup: (groupID) => {
      dispatch (groupSelect(groupID));
    },
    initSocket: (userID) => {
      dispatch (initSocket(userID));
    },
    followPlaylist: (group) => {
      dispatch (groupFollowPlaylist(group));
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
    alignItems: 'center',
    flexDirection: 'row'
  },
  viewProfileButton: {
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
  },
  groupList: {
    width: '100%'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);