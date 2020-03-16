import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';

export default ({
  group: {
    id,
    creatorID,
    playlistID
  },
  onPress
}) => {

  return (
    <TouchableOpacity
    style={styles.container}
    onPress={() => onPress({id, creatorID, playlistID})}
    >
      <View style={styles.playlistInfo}>
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