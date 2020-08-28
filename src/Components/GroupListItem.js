import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { ICON_CIRCLE } from '../constants/images';


export default ({
  group: {
    id,
    creatorID,
    playlistID,
    imageUrl,
    playlistName
  },
  userIDs,
  usersByID,
  onPress,
  userIsFollowing,
  onFollowPlaylistPressed
}) => {

  let imageSource = null;
  if (imageUrl) {
    imageSource = { uri: imageUrl };
  }
  else {
    imageSource = ICON_CIRCLE; //require("../resources/empty-playlist.png");
  }
  // else {
  //   for (const userID of userIDs) {
  //     const userImageUrl = usersByID[userID]?.imageUrl;
  //     if (userImageUrl) {
  //       imageSource = { uri: userImageUrl };
  //     }
  //   }
  // }
  // if (!imageSource) {
  //   imageSource = require("../resources/empty-playlist.png");
  // }
  
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress({id, creatorID, playlistID, playlistName})}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.viewTextStyle}>
          <Text style={styles.textStyle}>{'Hi'}</Text>
        </View>
      </View>
      <View style={styles.playlistInfo}>
        <Text>{playlistName}</Text>
        {userIDs && <Text>Users: {userIDs.toString()}</Text>}
      </View>
      {userIsFollowing === false &&
        <View style={styles.followPlaylistSection}>
          <TouchableOpacity 
            style={styles.followPlaylistButton}
            onPress={() => onFollowPlaylistPressed({id, creatorID, playlistID, playlistID, playlistName})}
          >
            <Text style={styles.followPlaylistText}>Follow</Text>
          </TouchableOpacity>
        </View>
      }
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%'
  },
  playlistInfo: {
    flex: 1,
    flexDirection: 'column'
  },
  followPlaylistSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10
  },
  followPlaylistButton: {
    backgroundColor: 'green'
  },
  followPlaylistText: {
    color: 'white', 
    fontWeight: 'bold',
    margin: 15
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewTextStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white'
  }
});