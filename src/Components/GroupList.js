import React from 'react';
import { 
  FlatList,
  Text
} from 'react-native';

import GroupListItem from './GroupListItem';
import Separator from './Separator';

export default ({ groups, onEndReached, onItemPressed }) => {

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => <GroupListItem group={item} onPress={onItemPressed} />}
      keyExtractor={group => group.id.toString()}
      ItemSeparatorComponent={() => <Separator /> }
      onEndReached={onEndReached}
      ListEmptyComponent={() => <Text>No groups.</Text>}
    />
  );

};