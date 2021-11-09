import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { DARK_GREEN } from '../constants/colors';


export default ({
  friend: {
    score,
    user: {
      displayName,
      imageUrl,
      spotifyUserID,
    }
  },
  onPress
}) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  return (
    <TouchableOpacity onPress={() => onPress(spotifyUserID)} style={_styles.container}>
      {imageUrl ? 
        <Image source={{uri: imageUrl}} style={styles.userImage} /> :
        <FontAwesome name='user-circle' size={100} color='grey' style={styles.userImage} />}
      <View style={styles.textView}>
        <Text numberOfLines={1} style={_styles.userDisplayNameText}>{displayName}</Text>
        {/* <Text numberOfLines={1}>Spotify User ID:</Text> */}
        <Text numberOfLines={1} style={_styles.spotifyUserIdText}>{spotifyUserID}</Text>
      </View>
      
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'flex-start',
      width: '100%',
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: theme.colors.background,
    },
    userDisplayNameText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.highlightText,// DARK_GREEN
      //backgroundColor: 'blue'
    },
    spotifyUserIdText: {
      color: theme.colors.text,
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
    //backgroundColor: 'yellow'
  },
  userImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  textView: {
  },
  // userDisplayNameText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: DARK_GREEN
  //   //backgroundColor: 'blue'
  // },
});