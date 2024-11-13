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
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch("http://10.13.226.154:3000/api/user/all", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjAwYTZmNDU2YjA2Y2U3ZWE0NjFiNiIsImlhdCI6MTczMDE1MzIzMywiZXhwIjoxNzMyNzQ1MjMzfQ.w31t6R5D_6EG_PHOxYvsXfn0lQ9Xcsu0pTP-5vpbvk0",
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
    router.navigate("Profile", { userId }); // Navigate to Profile screen with userId
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
