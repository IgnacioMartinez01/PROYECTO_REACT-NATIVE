import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Buscador</ThemedText>
          <HelloWave />
        </ThemedView>
      </ParallaxScrollView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.username}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
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
