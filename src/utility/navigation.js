export const navigateAndResetStack = (navigation, screenName) => {
  navigation.reset({
    routes: [{ name: screenName }]
  });
  
};