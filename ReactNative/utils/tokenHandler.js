import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

export default async function getToken() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

export async function deleteToken() {
  try {
    const token = await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}