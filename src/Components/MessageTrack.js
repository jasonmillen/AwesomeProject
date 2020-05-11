import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image
} from 'react-native';

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

  const artist = (trackInfo.artists && trackInfo.artists[0]) ? trackInfo.artists[0] : null;
  const trackImage = (trackInfo.album && trackInfo.album.images && trackInfo.album.images[0]) ? trackInfo.album.images[0] : null;
  const album = trackInfo.album ? trackInfo.album.name : null;

  // this is stupid - idk it cant parse w/ the extra characters in the date string
  // changes 2020-03-29T15:04:08.091+0000 to 2020-03-29T15:04:08.091
  sentTime = new Date(sentTime.slice(0, -5));

  const messageStyle = {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    justifyContent: (userID === senderID) ? 'flex-end' : 'flex-start'
  };

  const senderUser = usersByID[senderID];
  
  const displayName = senderUser ? senderUser.displayName : null;
  const imageUrl = senderUser ? senderUser.imageUrl : null;

  return (
    <TouchableOpacity style={messageStyle}>
      <View>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            {displayName && <Text style={{ marginRight: 5 }}>{displayName}</Text>}
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.userImage} />}
        </View>
        <View>
          { trackImage && trackImage.url && <Image source={{ uri: trackImage.url }} style={styles.trackImage} /> }
          <View>
            { trackInfo.name && <Text>{trackInfo.name}</Text>}
            { artist && artist.name && <Text>{artist.name}</Text> }
            {/* <Text>Sent: {sentTime.toLocaleString()}</Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>

  );
};

let styles = StyleSheet.create({
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 20/2
  },
  trackImage: {
    width: 120,
    height: 120,
    marginRight: 10
  },
  title: {}
});