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
import SearchSongButton from '../../Components/SearchSongButton';
import { 
  selectSpotifyUserID,
  selectUserID
} from '../../reducers/userReducer';
import { selectGroups } from '../../reducers/groupReduer';

import { fetchUserGetGroups } from '../../actions/groupActions';

class Home extends React.Component {

  static navigationOptions = ({ navigation, props }) => {
    return {
      title: navigation.getParam('spotifyUserID'),
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

    this.state = {
      groups: []
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      spotifyUserID: this.props.spotifyUserID,
      handleViewProfileButtonPress: this.handleViewProfileButtonPress,
      handleStartChatButtonPress: this.handleStartChatButtonPress,
      handleSearchSongButtonPress: this.handleSearchSongButtonPress
    });

    console.log("SENDING REQUEST TO GET USERS GROUPS");
    this.props.getGroupsForUser(this.props.userID);
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
  }

  render() {

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
  return {
    spotifyUserID: selectSpotifyUserID(state),
    userID: selectUserID(state),
    groups: selectGroups(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupsForUser: (userID) => {
      dispatch (fetchUserGetGroups(userID));
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
    marginLeft: 10,
    marginRight: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);