import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router, useNavigation } from "expo-router";
import getToken from "../../../utils/tokenHandler";

export default function HomeScreen() {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getAllUsers = async () => {
      const TOKEN = await getToken();

      try {
        const response = await fetch(BACKEND + "/api/user/all", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserPress = (userId) => {
    router.push({
      pathname: "/Buscador/ViewProfile", // Navigate to the relative route
      params: { userId: userId }, // Pass query parameters as an object
    });
    // navigation.push(`/Buscador/ViewProfile?userId=${userId}`)
    // router.navigate(`/ViewProfile?userId=${userId}`); // Navigate to Profile screen with userId
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.titleText} type="title">
            Buscador
          </ThemedText>
        </ThemedView>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre"
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : (
        filteredUsers.map((user) => (
          <TouchableOpacity
            key={user._id}
            onPress={() => handleUserPress(user._id)}
          >
            <View style={styles.userContainer}>
              <Image
                source={{
                  uri: user.profilePicture || "https://via.placeholder.com/50",
                }}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    marginBottom: 10,
  },
  titleContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    padding: 8,
    margin: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    color: "#000",
    backgroundColor: "#fff",
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
  loading: {
    marginTop: 20,
    alignSelf: "center",
  },
});
