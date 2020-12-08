import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

import ListItem from './ListItem';
import Separator from './Separator';

import { LIGHT_GREEN } from '../constants/colors';

export default ({ items, onEndReached, onItemPress, onItemLongPress, onScroll }) => {
  return (
    <FlatList
      style={styles.container}
      data={items}
      renderItem={({ item }) => <ListItem item={item} onPress={onItemPress} onLongPress={onItemLongPress} />}
      keyExtractor={item => item.id.toString()}
      //ItemSeparatorComponent={() => <Separator />}
      onEndReached={onEndReached}
      //ListEmptyComponent={() => <Text>No songs.</Text>}
      onScroll={onScroll}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: LIGHT_GREEN,
    //marginBottom: 50
  }
});