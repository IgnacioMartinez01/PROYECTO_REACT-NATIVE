import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const ProfilePage = ({ route }) => {
  // Hay que traer el user id del async storage, no de route 
  const { id } = (route || {}).params || {params: {id: 1}}; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    description: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/user/profile/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserData();
    }
  }, [token]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/user/profile/edit",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return user.user ? (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/100" }}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.username}>{user.user.username}</Text>
          {token && jwtDecode(token).id === id && (
            <Button title="Edit Profile" onPress={openModal} />
          )}
          <Text style={styles.profileStats}>
            {user.posts.length} posts | {user.user.friends.length} friends
          </Text>
          <Text style={styles.description}>
            {formData.description || "My description"}
          </Text>
        </View>
      </View>
      <View style={styles.gallery}>
        {[...Array(6)].map((_, index) => (
          <Image
            key={index}
            style={styles.galleryImage}
            source={{ uri: "https://via.placeholder.com/300" }}
          />
        ))}
      </View>

      {isModalOpen && (
        <ModalProfile
          formData={formData}
          closeModal={closeModal}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </ScrollView>
  ) : (
    <View style={styles.loadingContainer}>
      <Text >Creando cositas...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileDetails: {
    marginTop: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileStats: {
    marginTop: 8,
    fontSize: 16,
  },
  description: {
    marginTop: 12,
    fontStyle: "italic",
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryImage: {
    width: "48%",
    height: 150,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"white"
  },
});

export default ProfilePage;
