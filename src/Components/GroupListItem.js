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
  onPress
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
        <Text>Playlist ID: {playlistID}</Text>
      </View>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playlistInfo: {
    flexDirection: 'column',
    //alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  title: {}
});