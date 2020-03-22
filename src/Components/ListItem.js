import React, { Component } from 'react';
import { 
  View, 
  Image, 
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default({
  item: {
    id,
    title,
    artist,
    album,
    imageUri
  },
  onPress,
  onLongPress
}) => (
  <TouchableOpacity 
    style={styles.container}
    onPress={() => onPress(id, title)}
    onLongPress={() => onLongPress()}
  >
    <Image source={{ uri: imageUri }} style={styles.image}/>
    <View style={styles.songInfo}>
      <Text>Title: {title}</Text>
      <Text>Artist: {artist}</Text>
      <Text>Album: {album}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  songInfo: {
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
