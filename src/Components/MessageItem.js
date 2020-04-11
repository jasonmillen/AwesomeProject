import React from 'react';
import {
  Text
} from 'react-native';

import MessageTrack from './MessageTrack';

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

  return (
    <Text>Regular text message</Text>
  );
};