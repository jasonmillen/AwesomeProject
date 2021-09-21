import React from 'react';
import {
  Text
} from 'react-native';

import MessageTrack from './MessageTrack';
import MessageText from './MessageText';

export default ({
  message,
  userID,
  usersByID,
  messages,
  index
}) => {

  if (message.trackID && message.trackInfo) {
    return (
      <MessageTrack message={message} userID={userID} usersByID={usersByID} />
    );
  }
  else {
    return (
      <MessageText 
        message={message} 
        userID={userID} 
        usersByID={usersByID}
        messages={messages}
        index={index}/>
    );
  }
};