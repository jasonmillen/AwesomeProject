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
  },
  userID,
  usersByID,
  messages,
  index
}) => {

  const sentByMe = userID === senderID;
  let prevMessageUserSame = false;
  if (index < messages.length - 1) {
    prevMessageUserSame = messages[index + 1].senderID === senderID;
  }
  let nextMessageUserSame = false;
  if (index > 0) {
    nextMessageUserSame = messages[index - 1].senderID === senderID;
  }

  const _styles = getStyles(sentByMe, prevMessageUserSame, nextMessageUserSame);
  // if (!prevMessageUserSame) {
  //   _styles.messageStyle.backgroundColor = 'yellow';
  // }
  // else {
  //   _styles.messageStyle.backgroundColor = 'blue';
  // }


  const senderUser = usersByID[senderID];
  
  const displayName = senderUser ? senderUser.displayName : null;
  const imageUrl = senderUser ? senderUser.imageUrl : null;

  return (
    <View style={_styles.messageStyle}>
      <View style={styles.userImageView}>
        {!sentByMe && !nextMessageUserSame && (
          imageUrl ? 
          <Image source={{ uri: imageUrl }} style={styles.userImage} /> :
          <FontAwesome name="user-circle" size={28} color="gray" />
        )}
      </View>
      <View style={styles.content}>
        {!sentByMe && !prevMessageUserSame && displayName &&
          <Text style={{ marginLeft: 3, marginBottom: 0, color: 'gray' }}>{displayName}</Text>
        }
        <View style={_styles.textViewStyle}>
          <Text style={_styles.textStyle}>{content}</Text>
        </View>
      </View>
    </View>

  );
};


const getStyles = (sentByMe, prevMessageUserSame, nextMessageUserSame) => {
  return {
    messageStyle: {
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 20,
      marginTop: prevMessageUserSame ? 0 : 10,
      marginBottom: nextMessageUserSame ? 0 : 10,
      justifyContent: sentByMe ? 'flex-end' : 'flex-start',
    },
    textStyle: {
      // textAlign: sentByMe ? 'right' : 'left',
      color: 'white',
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 10,
      marginRight: 10
    },
    textViewStyle: {
      marginTop: 1,
      marginRight: sentByMe ? 0 : 40,
      backgroundColor: sentByMe ? LIGHT_BLUE : 'gray',
      // borderTopRightRadius: sentByMe ? 2 : 15,
      // borderTopLeftRadius: sentByMe ? 15 : 2,
      // borderBottomRightRadius: sentByMe ? 2 : 15,
      // borderBottomLeftRadius: sentByMe ? 15 : 2,
      borderRadius: 15,
      alignSelf: sentByMe ? 'flex-end' : 'flex-start',
    }
  }
};

let styles = StyleSheet.create({
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100
  },
  userImageView: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    marginRight: 10
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  }
});
