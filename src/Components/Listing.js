import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';

import ListItem from './ListItem';
import Separator from './Separator';

export default ({ items, onEndReached, onItemPress, onItemLongPress }) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ListItem item={item} onPress={onItemPress} onLongPress={onItemLongPress} />}
      keyExtractor={item => item.id.toString()}
      ItemSeparatorComponent={() => <Separator />}
      onEndReached={onEndReached}
      ListEmptyComponent={() => <Text>No songs.</Text>}
    />
  );
}