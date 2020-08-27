import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

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
    for (const userID of userIDs) {
      const userImageUrl = usersByID[userID]?.imageUrl;
      if (userImageUrl) {
        imageSource = { uri: userImageUrl };
      }
    }
    
  }
  
  
  require("../resources/empty-playlist.png");
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress({id, creatorID, playlistID, playlistName})}
    >
      <Image source={imageSource} style={styles.image} />
      <View style={styles.playlistInfo}>
        <Text>{playlistName}</Text>
        <Text>Users: {userIDs.toString()}</Text>
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
    alignContent: 'space-between',
    width: '100%'
  },
  playlistInfo: {
    flexDirection: 'column',
    //alignItems: 'center'
  },
  followPlaylistSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10
    //alignItems: 'flex-start'
    //alignContent: 'center'
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
  title: {}
});