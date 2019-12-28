import { AsyncStorage } from 'react-native';

export const saveTokenData = async (accessToken, expirationTime, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['expirationTime', expirationTime.toString()],
      ['refreshToken', refreshToken]
    ]);
  }
  catch (error) {
    console.log("error setting");
    console.log(error);
  }
};

export const getTokenData = async () => {
  const keys = ['accessToken', 'expirationTime', 'refreshToken'];
  try {
    const stores = await AsyncStorage.multiGet(keys);
    const userData = stores.reduce((data, store, i) => {
      data[store[0]] = store[1];
      return data;
    }, {});
    return userData;
  }
  catch (error) {
    console.log("error getting");
    console.log(error);
  }
};

export const setUserID = async (userID) => {
  try {
    await AsyncStorage.setItem('userID', userID);
  }
  catch (error) {
    console.error("Error setting userID", error);
  }
}

export const getUserID = async () => {
  try {
    const userID = await AsyncStorage.getItem('userID');
    return userID;

  }
  catch (error) {
    console.error('Error getting userID', error);
    return null;
  }
}


