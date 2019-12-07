import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AuthSession } from 'expo';
import SpotifyWebApi from 'spotify-web-api-js';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  saveUserData,
  getUserData
} from './src/api/asyncStorage/asyncStorage';

import reducer from './src/reducers/index';

// views
import Login from './src/Views/Login';
import Home from './src/Views/Home';


console.log("REDIRECT URL ############################");
console.log(AuthSession.getRedirectUrl());

import Search from './src/Components/Search';
import Listing from './src/Components/Listing';
import LoginButton from './src/Components/LoginButton';

//import searchMock from './src/api/spotify/searchMock';

import token from './src/api/spotify/token';
import search from './src/api/spotify/search';
//import { getTokens, refreshTokens } from './src/api/spotify/tokens';
import { getAuthorizationCode } from './src/api/spotify/auth';

const PAGE = 20;

const store = createStore(reducer);

/*const RootStack = createStackNavigator(
  {
    Login: Login,
    Home: Home
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(RootStack);*/


export default class App extends React.Component {

  // render() {
  //   return (
  //     <Provider store={store}>
  //       <AppContainer />
  //     </Provider>
  //   )
  // }

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

    const authCode = await getAuthorizationCode();
    console.log('authCode', authCode);

    const response = await fetch('http://192.168.1.7:3000/api/getSpotifyToken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authCode: authCode.params.code
      }),
    });

    const tokenData = await response.json()
    console.log('tokenData', tokenData);
    
    await saveUserData(
      tokenData.accessToken, 
      tokenData.expirationTime,
      tokenData.refreshToken);
    
    




    /*const spotify = new SpotifyWebApi();
    spotify.setAccessToken(data.accessToken);

    const userData = await spotify.getMe();
    console.log(userData);  

    await saveUserData(data.accessToken, data.expirationTime, data.refreshToken);
    await getUserData();*/
  }

  render() {
    const { songs, query, isFetching } = this.state;

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <LoginButton
            onPress={() => this.handleLogin()}
          />
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
      </Provider>
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
