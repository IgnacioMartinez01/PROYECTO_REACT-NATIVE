import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import getToken from "../../../utils/tokenHandler";
import { useNavigation } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleSave = async () => {
    const TOKEN = await getToken();

    try {
      const response = await fetch(BACKEND + "/api/user/profile/edit", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          description,
          profilePicture,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const TOKEN = await getToken();

      try {
        const decoded = jwtDecode(TOKEN);
        const userIdFromToken = decoded?.id;

        const response = await fetch(
          BACKEND + "/api/user/profile/" + userIdFromToken,
          {
            headers: {
              Authorization: "Bearer " + TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        setProfile(data.user);

        setUsername(data.user.username || "");
        setDescription(data.user.description || "");
        setProfilePicture(data.user.profilePicture || "");
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007bff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {profile ? (
          <>
            <Image
              source={{
                uri: profilePicture
                  ? BACKEND + "/" + profilePicture
                  : "https://via.placeholder.com/100",
              }}
              style={styles.profilePicture}
            />

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.nonEditable}>{profile.email}</Text>

            <Text style={styles.label}>Joined On:</Text>
            <Text style={styles.nonEditable}>
              {new Date(profile.createdAt).toLocaleDateString()}
            </Text>

            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              multiline
            />

            <Button title="Save" onPress={handleSave} />
          </>
        ) : (
          <Text>Loading profile...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 8,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  nonEditable: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditProfileScreen;
