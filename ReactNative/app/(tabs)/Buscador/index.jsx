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
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Buscador</Text>
          </View>
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
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.noResultsText}>No hay resultados</Text>
        ) : (
          filteredUsers.map((user) => (
            <TouchableOpacity
              key={user._id}
              onPress={() => handleUserPress(user._id)}
            >
              <View style={styles.userContainer}>
                <Image
                  source={{
                    uri:
                      user.profilePicture || "https://via.placeholder.com/50",
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  loading: {
    marginTop: 20,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});
