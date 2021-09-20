import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons'; 

import { LIGHT_BLUE } from '../constants/colors';

export default ({
  message: {
    id,
    groupID,
    senderID,
    content,
    sentTime,
    trackID,
    trackInfo
  },
  userID,
  usersByID
}) => {

  const sentByMe = userID === senderID;
  const _styles = getStyles(sentByMe);

  const artist = (trackInfo.artists && trackInfo.artists[0]) ? trackInfo.artists[0] : null;
  const trackImage = (trackInfo.album && trackInfo.album.images && trackInfo.album.images[0]) ? trackInfo.album.images[0] : null;
  const album = trackInfo.album ? trackInfo.album.name : null;

  // this is stupid - idk it cant parse w/ the extra characters in the date string
  // changes 2020-03-29T15:04:08.091+0000 to 2020-03-29T15:04:08.091
  sentTime = new Date(sentTime.slice(0, -5));

  const senderUser = usersByID[senderID];
  
  const displayName = senderUser ? senderUser.displayName : null;
  const imageUrl = senderUser ? senderUser.imageUrl : null;

  return (
    <View style={_styles.messageStyle}>
      { !sentByMe && 
        <View style={styles.userImageView}>
          {imageUrl ? 
          <Image source={{ uri: imageUrl }} style={styles.userImage} /> :
          <FontAwesome name="user-circle" size={28} color="gray" />
          }
        </View>
      }
      <View>
        {!sentByMe && displayName && <Text style={{ marginLeft: 10, marginBottom: 2, color: 'gray' }}>{displayName}</Text>}
        <View style={_styles.trackInfo}>
          { trackImage && trackImage.url && <Image source={{ uri: trackImage.url }} style={_styles.trackImage} /> }
          <View>
            { trackInfo.name && 
              <View style={_styles.trackNameViewStyle}>
                <Text numberOfLines={1} style={_styles.trackNameTextStyle}>{trackInfo.name}</Text>
              </View>
            }
            { artist && artist.name && 
              <View style={_styles.trackArtistViewStyle}>
                <Text numberOfLines={1} style={_styles.trackArtistTextStyle}>{artist.name}</Text>
              </View>
            }
          </View>
        </View>
      </View>
    </View>

  );
};

const getStyles = (sentByMe) => {
  return {
    messageStyle: {
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
      justifyContent: sentByMe ? 'flex-end' : 'flex-start'
    },
    trackNameViewStyle: {
      marginTop: 1,
      marginRight: sentByMe ? 0 : 40,
      backgroundColor: sentByMe ? LIGHT_BLUE : 'gray',
      borderTopRightRadius: sentByMe ? 2 : 15,
      borderTopLeftRadius: sentByMe ? 15 : 2,
      borderBottomRightRadius: sentByMe ? 2 : 15,
      borderBottomLeftRadius: sentByMe ? 15 : 2,
      // borderRadius: 15,
      alignSelf: sentByMe ? 'flex-end' : 'flex-start'
    },
    trackNameTextStyle: {
      // textAlign: sentByMe ? 'right' : 'left',
      color: 'white',
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 10,
      marginRight: 10
    },
    trackArtistViewStyle: {
      marginTop: 1,
      backgroundColor: sentByMe ? LIGHT_BLUE : 'gray',
      borderTopRightRadius: sentByMe ? 2 : 15,
      borderTopLeftRadius: sentByMe ? 15 : 2,
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      // borderRadius: 15,
      alignSelf: sentByMe ? 'flex-end' : 'flex-start'
    },
    trackArtistTextStyle: {
      // textAlign: sentByMe ? 'right' : 'left',
      color: 'white',
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 10,
      marginRight: 10
    },
    trackImage: {
      width: 150,
      height: 150,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomRightRadius: sentByMe ? 2 : 15,
      borderBottomLeftRadius: sentByMe ? 15 : 2,
      //borderRadius: 15,
      borderWidth: 2,
      borderColor: sentByMe ? LIGHT_BLUE : 'gray'
    },
    trackInfo: {
      flex: 1,
      alignItems: sentByMe ? 'flex-end' : 'flex-start'
    }
  }
}

let styles = StyleSheet.create({
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100
  },
  userImageView: {
    alignSelf: 'flex-end',
    marginRight: 10,
    width: 30,
    height: 30
  }
});