import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { DARK_GREEN } from '../constants/colors';


export default ({
  friend: {
    score,
    spotifyUserId,
    user: {
      displayName,
      imageUrl,
    }
  },
  onPress
}) => {

  return (
    <TouchableOpacity onPress={() => onPress(spotifyUserId)} style={styles.container}>
      {imageUrl ? 
        <Image source={{uri: imageUrl}} style={styles.userImage} /> :
        <FontAwesome name='user-circle' size={100} color='grey' style={styles.userImage} />}
      <View style={styles.textView}>
        <Text numberOfLines={1} style={styles.userDisplayNameText}>{displayName}</Text>
        {/* <Text numberOfLines={1}>Spotify User ID:</Text> */}
        <Text numberOfLines={1}>{spotifyUserId}</Text>
      </View>
      
    </TouchableOpacity>
  );
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
  userDisplayNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GREEN
    //backgroundColor: 'blue'
  },
});