import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';


export default (props) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  const { displayName, imageUrl, spotifyUserID } = props;

  return (
    <View style={styles.container}>
      <Text style={_styles.displayName}>{displayName}</Text>
      {imageUrl ? 
        <Image
          style={styles.userImage}
          source={{uri: imageUrl}}/> :
        <FontAwesome name='user-circle' size={150} color='grey' />
      }
      <Text style={_styles.spotifyUserIdText}>Spotify User ID: {spotifyUserID}</Text>
    </View>
  );
};

const getStyles = (theme) => {
  return {
    displayName: {
      fontSize: 30,
      color: theme.colors.highlightText,
    },
    spotifyUserIdText: {
      color: theme.colors.text,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    //flex: .75,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userImage: {
    borderRadius: 15,
    marginTop: 12,
    marginBottom: 4,
    width: 170, 
    height: 170
  },
});