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
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import getToken from "../../../utils/tokenHandler";
import { useNavigation } from "expo-router";
import {jwtDecode} from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchProfileData = async () => {
    const TOKEN = await getToken();

    try {
      const decoded = jwtDecode(TOKEN);
      const userIdFromToken = decoded?.id;

      const response = await fetch(
        `${BACKEND}/api/user/profile/${userIdFromToken}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching profile data");
      }

      const data = await response.json();
      setProfile(data.user);
      setUsername(data.user.username || "");
      setDescription(data.user.description || "");
      setProfilePicture(data.user.profilePicture || "");
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSave = async () => {
    const TOKEN = await getToken();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    if (imageFile) {
      formData.append("profilePicture", {
        uri: imageFile.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch(`${BACKEND}/api/user/profile/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      navigation.navigate("index")
      await fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
      setProfilePicture(result.assets[0].uri);
    }
  };

  useEffect(() => {
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
                  ? profilePicture
                  : "https://via.placeholder.com/100",
              }}
              style={styles.profilePicture}
            />

            <View style={styles.buttonRow}>
              <Button title="Choose from Gallery" onPress={handleImagePicker} />
              <Button title="Take a Photo" onPress={handleCamera} />
            </View>

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


