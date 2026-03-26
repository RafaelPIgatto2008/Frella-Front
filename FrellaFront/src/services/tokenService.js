import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@frella/accessToken';

export const saveAccessToken = async (accessToken) => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getAccessToken = async () => {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
};
