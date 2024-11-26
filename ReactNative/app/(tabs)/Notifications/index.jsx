import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import getToken from "../../../utils/tokenHandler";

export default function Notifications() {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      const TOKEN = await getToken();

      try {
        const response = await fetch(BACKEND + "/api/user/notifications", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching notifications");
        }

        const data = await response.json();

        // Ordenar notificaciones por fecha (descendente)
        const sortedNotifications = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Could not load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header estilo Instagram */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Lista de notificaciones */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            {/* Imagen del usuario */}
            <Image
              source={{
                uri:
                  item.fromUserId.profilePicture ||
                  "https://via.placeholder.com/50",
              }}
              style={styles.userAvatar}
            />
            {/* Texto de la notificación */}
            <Text style={styles.notificationText}>
              {item.type === "follow"
                ? `${item.fromUserId.username} started following you.`
                : `${item.fromUserId.username} liked your post.`}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
