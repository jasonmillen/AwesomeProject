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
  onPress,
  userIsFollowing,
  onFollowPlaylistPressed
}) => {

  const imageSource = imageUrl ? { uri: imageUrl } : require("../resources/empty-playlist.png");
  return (
    <TouchableOpacity
    style={styles.container}
    onPress={() => onPress({id, creatorID, playlistID, playlistName})}
    >
      <Image source={imageSource} style={styles.image} />
      <View style={styles.playlistInfo}>
        <Text>{playlistName}</Text>
        {/* <Text>Playlist ID: {playlistID}</Text> */}
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
    marginRight: 10
  },
  title: {}
});