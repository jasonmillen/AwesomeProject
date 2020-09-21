import React from 'react';
import { createStore, applyMiddleware } from 'redux'; 
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import reducer from './src/reducers/index';

// views
import Splash from './src/Views/Splash/splash';
import Login from './src/Views/Login/login';
import Home from './src/Views/Home/home';
import Group from './src/Views/Group/group';
import UserProfile from './src/Views/UserProfile/userProfile';
import SearchUser from './src/Views/SearchUser/searchUser';
import SearchSong from './src/Views/SearchSong/searchSong';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }}/>
            <Stack.Screen
              name="Login"
              component={Login} 
              options={{ headerShown: false }}/>
            <Stack.Screen
              name="Home"
              component={Home}/>
            <Stack.Screen
              name="Group"
              component={Group}/>
            <Stack.Screen
              name="UserProfile"
              component={UserProfile} 
              options={{ title: 'Profile' }}/>
            <Stack.Screen
              name="SearchUser"
              component={SearchUser}
              options={{ title: 'Search For Users' }}/> 
            <Stack.Screen
              name="SearchSong"
              component={SearchSong} />
              {/* options={{ title: 'Search For Song' }}/>  */}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
};

