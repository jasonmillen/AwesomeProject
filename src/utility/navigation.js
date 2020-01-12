import {
  StackActions,
  NavigationActions
} from 'react-navigation';

export const navigateAndResetStack = (navigation, screenName) => {
  navigation.navigate(screenName);
  navigation.dispatch(StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: screenName })]
  }));
};