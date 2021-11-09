import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux'; 
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { allReducers } from './src/reducers/index';

// views
import Splash from './src/Views/Splash/splash';
import Login from './src/Views/Login/login';
import Home from './src/Views/Home/home';
import Group from './src/Views/Group/group';
import UserProfile from './src/Views/UserProfile/userProfile';
import SearchUser from './src/Views/SearchUser/searchUser';
import SearchSong from './src/Views/SearchSong/searchSong';
import StartChat from './src/Views/StartChat/startChat';

import { LIGHT_GREEN, DARK_GREEN, GREY_GREEN } from './src/constants/colors';

const store = createStore(allReducers, applyMiddleware(thunkMiddleware));

const Stack = createStackNavigator();

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    icon: 'black',
    textInputBackground: GREY_GREEN,
    textInputPlaceholder: 'grey',
    highlightText: DARK_GREEN,
  },
};


const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    icon: LIGHT_GREEN,
    textInputBackground: 'darkslategrey',
    textInputPlaceholder: 'grey',
    highlightText: LIGHT_GREEN,
  },
};

export default class App extends React.Component {

  componentDidMount() {
    StatusBar.setBarStyle( 'light-content',true)
  }

  render() {

    const theme = CustomDarkTheme;

    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer theme={theme}>
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
                component={Home}
                initialParams={{ theme }}/>
              <Stack.Screen
                name="Group"
                component={Group}/>
              <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                initialParams={{ theme }}/>
              <Stack.Screen
                name="SearchUser"
                component={SearchUser}
                initialParams={{ theme }}/> 
              <Stack.Screen
                name="StartChat"
                component={StartChat}
                initialParams={{ theme }}/> 
              <Stack.Screen
                name="SearchSong"
                component={SearchSong}
                options={{ headerShown: false }}
                initialParams={{ theme }}/>
                {/* options={{ title: 'Search For Song' }}/>  */}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    )
  }
};

// export default function App() {

//   let colorScheme = useColorScheme();
//   colorScheme = 'dark';

//   const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme;

//   return (
//     <Provider store={store}>
//     <SafeAreaProvider>
//       <NavigationContainer theme={theme}>
//         <Stack.Navigator initialRouteName="Splash">
//           <Stack.Screen
//             name="Splash"
//             component={Splash}
//             options={{ headerShown: false }}/>
//           <Stack.Screen
//             name="Login"
//             component={Login} 
//             options={{ headerShown: false }}/>
//           <Stack.Screen
//             name="Home"
//             component={Home}
//             initialParams={{ theme }}/>
//           <Stack.Screen
//             name="Group"
//             component={Group}/>
//           <Stack.Screen
//             name="UserProfile"
//             component={UserProfile}/>
//           <Stack.Screen
//             name="SearchUser"
//             component={SearchUser}
//             initialParams={{ theme }}/> 
//           <Stack.Screen
//             name="SearchSong"
//             component={SearchSong}
//             options={{ headerShown: false }}
//             initialParams={{ theme }}/>
//             {/* options={{ title: 'Search For Song' }}/>  */}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   </Provider>
//   );
// };

