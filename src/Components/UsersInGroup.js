import React from 'react';
import { 
  Text,
  StyleSheet,
  View,
} from 'react-native';

import UserNameInGroup from './UserNameInGroup';

import { useTheme } from '@react-navigation/native';

export default ({ 
  users,
  onRemoveUserFromStartChatList,
}) => {

  const theme = useTheme();
  const _styles = getStyles(theme);

  const userNamesInGroup = users.map(user => 
    <UserNameInGroup 
      key={user.spotifyUserID} 
      displayName={user.displayName}
      onRemove={() => onRemoveUserFromStartChatList(user)}
    />
  );

  return <View style={styles.container}>{userNamesInGroup}</View>
};

const getStyles = (theme) => {
  return {
    text: {
      color: theme.colors.text,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 7,
    marginTop: 3,
    marginBottom: 3,
  },
})