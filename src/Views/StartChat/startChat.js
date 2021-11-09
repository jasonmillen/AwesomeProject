import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import SearchForUserBar from '../../Components/SearchForUserBar';
import UserInfo from '../../Components/UserInfo';

import { searchUser } from '../../api/spotify/user';
import { spotifyUserToSsUser } from '../../api/transform';

class StartChat extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      searchUserInputText: '',
      searchedSpotifyUserID: '',
      searchedUser: null,
      userFound: false,
      searchingForUser: false,
      errorSearchingForUser: false,
      usersInGroup: [],
      usersInGroupSet: new Set(),
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
        searchingForUser: true, 
        errorSearchingForUser: false,
        searchedSpotifyUserID: searchText,
      });
      console.log('searching for user: ' + searchText);
      const user = await searchUser(searchText);
      console.log("FOUND USER: ", user);
      this.setState({ searchingForUser: false });
      if (!user) {
        this.setState({ userFound: false, searchedUser: null });
      }
      else {
        this.setState({ userFound: true, searchedUser: spotifyUserToSsUser(user) });
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

  render () {

    const theme = this.props.route.params.theme;
    const _styles = getStyles(theme);

    let body;
    if (this.state.errorSearchingForUser) {
      body = (
        <Text style={_styles.text}>
          Error searching for user {this.state.searchUserText}
        </Text>);
    }
    else if (this.state.searchedSpotifyUserID && !this.state.searchedUser) {
      body = (
        <Text style={_styles.text}>
          Could not find user: {this.state.searchUserText}
        </Text>);
    }
    else if (this.state.searchedSpotifyUserID && this.state.searchedUser) {
      body = (
        <UserInfo
          displayName={this.state.searchedUser.displayName}
          spotifyUserID={this.state.searchedUser.spotifyUserID}
          imageUrl={this.state.searchedUser.imageUrl}
        />);
    }
    else if (/*friends list not null and length > 0*/true) {
      body = (<Text style={_styles.text}>FRIEND LIST</Text>);
    }
    else {
      body = (<Text></Text>);
    }

    return (
      <View>
        <SearchForUserBar
          text={this.state.searchUserText}
          handleSearchClick={() => this.handleSearchForUser()}
          textChanged={text => this.handleOnSearchTextChanged(text)}
          placeholderText='Enter a Spotify User ID'
          handleSearchSubmit={_text => this.handleSearchForUser()}
          clearText={() => this.handleClearSearchText()}
        />
        {body}
      </View>
    );
  }

};

const mapStateToProps = (state) => {

  return {
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

});

export default connect(mapStateToProps, mapDispatchToProps)(StartChat);