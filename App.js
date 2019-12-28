import React from 'react';
import { createStore, applyMiddleware } from 'redux'; 
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import reducer from './src/reducers/index';

// views
import Splash from './src/Views/Splash/splash';
import Login from './src/Views/Login/login';
import Home from './src/Views/Home/home';
import UserProfile from './src/Views/UserProfile/userProfile';
import SearchUser from './src/Views/SearchUser/searchUser';
import SearchSong from './src/Views/SearchSong/searchSong';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const RootStack = createStackNavigator(
  {
    Splash,
    Login,
    Home,
    UserProfile,
    SearchUser,
    SearchSong
  },
  {
    initialRouteName: 'Splash'
  }
);

const AppContainer = createAppContainer(RootStack);


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
};
