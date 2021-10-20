import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { isValidDate, getDateDisplayString } from '../utility/util';
import { LIGHT_GREEN, DARK_GREEN } from '../constants/colors';
import { messagesGetForGroupSuccess } from '../actions/messageActions';

export default ({
  group: {
    id,
    creatorID,
    playlistID,
    imageUrl,
    playlistName,
    lastUpdateTime
  },
  userIDs,
  usersByID,
  messages,
  onPress,
  userIsFollowing,
  onFollowPlaylistPressed,
  getMessagesForGroupSuccess
}) => {

  const theme = useTheme();
  const _styles = getStyes(theme);

  let imageSource = null;
  if (imageUrl) {
    imageSource = { uri: imageUrl };
  }

  //userIsFollowing = Math.random() > 0.5 ? false : userIsFollowing;

  const lastUpdateTimeAsDate = lastUpdateTime ? new Date(lastUpdateTime): null;
  if (lastUpdateTimeAsDate && !isValidDate(lastUpdateTimeAsDate)) {
    console.error('Tried to parse invalid date: ', lastUpdateTime);
    lastUpdateTimeAsDate = null;
  }

  let groupDisplayMessage = null;
  if (!getMessagesForGroupSuccess) {
    groupDisplayMessage = '';
  }
  else if (messages && messages.length > 0) {
    const message = messages[0];
    if (message.trackID) {
      const artist = (message.trackInfo.artists && message.trackInfo.artists[0]) ? message.trackInfo.artists[0] : null
      const trackName = message.trackInfo.name || null;
      groupDisplayMessage = (artist && artist.name && trackName) ? `${artist.name}, ${trackName}` : '';
    }
    else {
      groupDisplayMessage = message.content;
    }
  }
  else {
    groupDisplayMessage = 'No messages yet';
  }
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress({id, creatorID, playlistID, playlistName})}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={imageSource ? styles.image : styles.nonPlaylistImage} />
        {imageSource == null &&
          <View style={styles.nonPlaylistImageViewTextStyle}>
            <Text style={styles.nonPlaylistImageTextStyle}>{playlistName ? playlistName.charAt(0) : '?'}</Text>
          </View>
        }
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistNameText}>{playlistName}</Text>
      <Text numberOfLines={1} style={_styles.playlistText}>{groupDisplayMessage}</Text>
      </View>
      <View style={styles.screenRightSide}>
        {!userIsFollowing &&
          <View style={styles.followPlaylistSection}>
            <TouchableOpacity 
              style={styles.followPlaylistButton}
              onPress={() => onFollowPlaylistPressed({id, creatorID, playlistID, playlistID, playlistName})}
            >
              <Text style={styles.followPlaylistText}>Follow</Text>
            </TouchableOpacity>
          </View>
        }
        {userIsFollowing && lastUpdateTimeAsDate && 
          <View>
            <Text style={_styles.groupLastUpdateTimeText}>{getDateDisplayString(lastUpdateTimeAsDate)}</Text>
          </View>
        }
      </View>
    </TouchableOpacity>

  );
};

const getStyes = (theme) => {
  return {
    playlistText: {
      color: theme.colors.text
    },
    groupLastUpdateTimeText: {
      color: theme.colors.text,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%'
  },
  playlistInfo: {
    flex: 0.75,
    flexDirection: 'column'
  },
  playlistNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GREEN,
  },
  followPlaylistSection: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  followPlaylistButton: {
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN
  },
  followPlaylistText: {
    color: 'white', 
    fontWeight: 'bold',
    margin: 15
  },
  image: {
    width: 65,
    height: 65,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 100
  },
  nonPlaylistImage: {
    width: 65,
    height: 65,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 100
  },
  imageContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nonPlaylistImageViewTextStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nonPlaylistImageTextStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  screenRightSide: {
    flex: 0.45,
    alignItems: 'center'
  }
});