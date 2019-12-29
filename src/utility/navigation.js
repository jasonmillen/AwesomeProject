export const navigateAndResetStack = (screenName) => {
  this.props.navigation.navigate(screenName);
  this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screenName })]
    }));
};