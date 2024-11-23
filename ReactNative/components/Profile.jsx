import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import getToken from "../utils/tokenHandler";
import formatDate from "../utils/timeHelper";
import {
  useLocalSearchParams,
  useNavigation,
  useFocusEffect,
  useRouter,
} from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const navigation = useNavigation();
  const router = useRouter();

  const { userId } = useLocalSearchParams();

  const [cleanedUpUserId, setCleanedUpUserId] = useState();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchProfileData = async () => {
    const TOKEN = await getToken();
    const decoded = await jwtDecode(TOKEN);
    const userIdFromToken = decoded?.id;

    try {
      const response = await fetch(
        BACKEND + "/api/user/profile/" + (userId ? userId : userIdFromToken),
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProfile(data.user);
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // When the tab is focused, retain the params
      fetchProfileData();

      // When leaving the tab, clear the params
      return () => {
        setCleanedUpUserId(); // Clear local state
        router.setParams({ userId: undefined }); // Clear URL param
      };
    }, [cleanedUpUserId, router])
  );

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image
        source={{
          uri: BACKEND + "/" + item.imageUrl,
        }}
        style={styles.postImage}
      />
      <View style={styles.captionLikesRow}>
        <Text style={styles.postCaption}>{item.caption}</Text>
        <Text style={styles.postLikes}>
          {item.likes.length} {item.likes.length === 1 ? "Like" : "Likes"}
        </Text>
      </View>

      {/* Post Date */}
      <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {userId ? <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007bff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity> : null}
        {profile ? (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri: profile.profilePicture
                    ? BACKEND + "/" + profile.profilePicture
                    : "https://via.placeholder.com/100",
                }}
                style={styles.profilePicture}
              />
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.description}>
                {profile.description || "No description provided"}
              </Text>
              {userId ? null : <Button
                title="Edit Profile"
                onPress={() => navigation.push("EditProfile")}
              />}
            </View>

            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.postsList}
            />
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
    backgroundColor: "#fff",
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
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  postsList: {
    paddingHorizontal: 10,
  },
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  captionLikesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  postCaption: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  postLikes: {
    fontSize: 14,
    color: "gray",
  },
  postDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});

export default ProfileScreen;
