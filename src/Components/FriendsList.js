import React from 'react';
import { 
  FlatList,
  Text
} from 'react-native';

import FriendListItem from './FriendListItem';
import Separator from './Separator';

export default ({ 
  friends,
  onEndReached, 
  onItemPressed, 
  style 
}) => {
  
  const renderItemFunc = ({item}) => {
    const friend = item; // item is just the friend

    return (
      <FriendListItem
        friend={friend} 
        onPress={spotifyUserID => onItemPressed(spotifyUserID)} />
    );
  };

  return (
    <FlatList
      data={friends}
      renderItem={renderItemFunc}
      keyExtractor={friend => friend.user.spotifyUserID}
      ItemSeparatorComponent={() => <Separator /> }
      onEndReached={onEndReached}
      ListEmptyComponent={() => <Text>No friends</Text>}
      style={style}
    />
  );

};