import React from 'react';
import {
  Text
} from 'react-native';

import MessageTrack from './MessageTrack';
import MessageText from './MessageText';

export default ({
  message,
  userID,
  usersByID
}) => {

  if (message.trackID && message.trackInfo) {
    return (
      <MessageTrack message={message} userID={userID} usersByID={usersByID} />
    );
  }
  else {
    return (
      <MessageText message={message} userID={userID} usersByID={usersByID} />
    );
  }

  return (
    <Text>Regular text message</Text>
  );
};