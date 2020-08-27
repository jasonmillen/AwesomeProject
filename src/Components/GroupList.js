import React from 'react';
import { 
  FlatList,
  Text
} from 'react-native';

import GroupListItem from './GroupListItem';
import Separator from './Separator';

export default ({ 
  groups,
  usersByID,
  usersByGroupID,
  groupFollowStatusByID, 
  onEndReached, 
  onItemPressed, 
  onFollowPlaylistPressed,
  style 
}) => {
  
  const renderItemFunc = ({item}) => {
    const group = item; // item is just the group
    const userIsFollowing = groupFollowStatusByID[group.id];
    return (
      <GroupListItem 
        group={group} 
        userIDs={usersByGroupID[group.id]}
        usersByID={usersByID}
        onPress={onItemPressed} 
        userIsFollowing={userIsFollowing}
        onFollowPlaylistPressed={onFollowPlaylistPressed}/>
    );
  };

  return (
    <FlatList
      data={groups}
      renderItem={renderItemFunc}
      keyExtractor={group => group.id.toString()}
      ItemSeparatorComponent={() => <Separator /> }
      onEndReached={onEndReached}
      ListEmptyComponent={() => <Text>No groups</Text>}
      style={style}
    />
  );

};