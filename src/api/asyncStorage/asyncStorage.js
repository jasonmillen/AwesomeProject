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
    console.log('Error saving token data', error);
    throw error;
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
    console.log('Error getting token data', error);
    throw error;
  }
};

export const setUserID = async (userID) => {
  try {
    await AsyncStorage.setItem('userID', userID);
  }
  catch (error) {
    console.error("Error setting userID", error);
    throw error;
  }
};

export const getUserID = async () => {
  try {
    const userID = await AsyncStorage.getItem('userID');
    return userID;

  }
  catch (error) {
    console.error('Error getting userID', error);
    throw error;
  }
};

export const setSpotifyUserID = async (userID) => {
  try {
    await AsyncStorage.setItem('spotifyUserID', userID);
  }
  catch (error) {
    console.error("Error setting spotifyUserID", error);
    throw error;
  }
};

export const getSpotifyUserID = async () => {
  try {
    const userID = await AsyncStorage.getItem('spotifyUserID');
    return userID;

  }
  catch (error) {
    console.error('Error getting spotifyUserID', error);
    throw error;
  }
};

export const removeUserIDAndTokenData = async () => {
  try {
    await AsyncStorage.multiRemove(['userID', 'accessToken', 'expirationTime', 'refreshToken']);
  }
  catch (error) {
    console.error ('Error removing userID and token data', error);
    throw error;
  }
};

export const removeSpotifyUserIDAndTokenData = async () => {
  try {
    await AsyncStorage.multiRemove(['spotifyUserID', 'accessToken', 'expirationTime', 'refreshToken']);
  }
  catch (error) {
    console.error ('Error removing spotifyUuserID and token data', error);
    throw error;
  }
};