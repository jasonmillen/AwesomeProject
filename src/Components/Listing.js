import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';

import ListItem from './ListItem';
import Separator from './Separator';

export default ({ items, onEndReached, onItemPress }) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ListItem item={item} onPress={onItemPress} />}
      keyExtractor={item => item.id.toString()}
      ItemSeparatorComponent={() => <Separator />}
      onEndReached={onEndReached}
      ListEmptyComponent={() => <Text>No songs.</Text>}
    />
  );
}