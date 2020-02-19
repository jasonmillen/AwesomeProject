import { 
  FlatList
} from 'react-native';

import Separator from './Separator';

export default ({ groups, onEndReached, onItemPressed }) => {

  return (
    <FlatList
      data={groups}
      ItemSeparatorComponent={() => <Separator /> }
    />
  );

};