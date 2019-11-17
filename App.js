import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  ActivityIndicator
 } from 'react-native';

 import { AuthSession } from 'expo';
 console.log("REDIRECT URL ############################");
 console.log(AuthSession.getRedirectUrl());

import Search from './src/Components/Search';
import Listing from './src/Components/Listing';
import LoginButton from './src/Components/LoginButton';

//import searchMock from './src/api/spotify/searchMock';

import token from './src/api/spotify/token';
import search from './src/api/spotify/search';
import { getTokens, refreshTokens } from './src/api/spotify/tokens';

const PAGE = 20;

export default class App extends React.Component {

  constructor() {
    super();

    this.state = {
      songs: [],
      offset: 0,
      query: 'Shpongle',
      isFetching: false,
      isEmpty: false,
      token: null,
      isTokenFetching: false,
      spotify: {
        accessToken: null,
        refreshToken: null,
        expirationTime: null
      }
    };
  }

  async componentDidMount() {
    await this.refreshToken();
    await this.loadNextPage();
  }

  async loadNextPage() {
    const { songs, offset, query, token, isFetching, isEmpty } = this.state;

    if (isFetching || isEmpty) {
      return;
    }

    this.setState({ isFetching: true });

    const newSongs = await search({
      offset,
      limit: PAGE,
      q: query,
      token
    });

    if (newSongs.length === 0) {
      console.log('No songs found. There may be an error.');
      this.setState({ isEmpty: true });
    }

    this.setState({
      isFetching: false,
      songs: [...songs, ...newSongs],
      offset: offset + PAGE
    });
  }

  async refreshToken() {
    this.setState({
      isTokenFetching: true
    });

    const newToken = await token();

    this.setState({
      token: newToken,
      isTokenFetching: false
    });
  }

  handleSearchChange(text) {
    this.setState({
      isEmpty: false,
      query: text,
      offset: 0,
      songs: [],
    }, () => {
      this.loadNextPage();
    });

    console.log('search text is', text);
  }

  async handleEndReached() {
    await this.loadNextPage();
  }

  async handleLogin() {
    console.log("user logged in");

    console.log("before");
    const data = await getTokens();
    console.log("data");
    console.log(data);
  
  }

  render() {
    const { songs, query, isFetching } = this.state;

    return (
      <View style={styles.container}>
        <LoginButton
          onPress={() => this.handleLogin()}
         />
        <Text>Open up App.js to start working on your app!</Text>
        <Search 
          onChange={text => this.handleSearchChange(text)}
          text={query}
        />
        {
          (isFetching && songs.length === 0)
          ? <ActivityIndicator />
          : <Listing
            items={songs}
            onEndReached={() => this.handleEndReached()} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 10,
    marginTop: 50
  },
});
