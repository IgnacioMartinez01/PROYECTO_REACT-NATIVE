import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const TOKEN = await getToken(); // Obtén el token desde tu lógica

      try {
        const response = await fetch(BACKEND + "/api/notifications", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching notifications");
        }

        const data = await response.json();
        setNotifications(data); // Guarda las notificaciones en el estado
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Detiene la animación de carga
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.titleContainer}>
          <ThemedText variant="h1">Notifications</ThemedText>{" "}
          {/* Cambia el tamaño del texto */}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>
              {item.type === "follow"
                ? `${item.fromUserId.username} started following you.`
                : `${item.fromUserId.username} liked your post.`}
            </Text>
          </View>
        )}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  notificationText: {
    fontSize: 16,
  },
});
