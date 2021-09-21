import React from 'react';
import { 
  FlatList,
  Text
} from 'react-native';

import MessageItem from './MessageItem';

export default ({ messages, userID, usersByID, onEndReached, style }) => {

  return (
    <FlatList
      inverted
      ref={ref => this.flatList = ref}
      //initialNumToRender={1}
      //onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
      //onLayout={() => this.flatList.scrollToEnd({ animated: false })}
      data={messages}
      renderItem={({ item, index }) => 
        <MessageItem 
          message={item} 
          userID={userID} 
          usersByID={usersByID} 
          messages={messages}
          index={index} />}
      keyExtractor={message => message.id.toString()}
      onEndReached={onEndReached}
      //ListEmptyComponent={() => <Text>No messages.</Text>}
      style={style}
    />

  );

};
