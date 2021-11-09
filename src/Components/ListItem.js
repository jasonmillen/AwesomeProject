import React, { Component } from 'react';
import { 
  View, 
  Image, 
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { GREY_GREEN, LIGHT_GREEN, DARK_GREEN } from '../constants/colors';

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
}) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress({ id, title, artist, album, imageUri })}
      onLongPress={() => onLongPress(id)}
    >
      <Image source={{ uri: imageUri }} style={styles.image}/>
      <View style={styles.songInfo}>
        <Text numberOfLines={1} style={_styles.songTitleText}>{title}</Text>
        <Text numberOfLines={1} style={_styles.songArtistText}>{artist}</Text>
        {/* <Text>Album: {album}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return {
    songArtistText: {
      color: theme.colors.text,
    },
    songTitleText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.highlightText,// DARK_GREEN
      //backgroundColor: 'blue'
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: GREY_GREEN,
    margin: 5
  },
  songInfo: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'center',
    marginRight: 10,
    //backgroundColor: 'grey'
  },
  // songTitleText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: DARK_GREEN
  //   //backgroundColor: 'blue'
  // },
  // songArtistText: {
  //   //color: 'grey'
  // },
  image: {
    width: 75,
    height: 75,
    marginRight: 10,
    // borderWidth: 5,
    // borderColor: LIGHT_GREEN,
    borderRadius: 15
  },
  title: {}
});
