import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import getToken from "../../../utils/tokenHandler";

const ProfileScreen = () => {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const TOKEN = await getToken();

      try {
        const response = await fetch(
          BACKEND + "/api/user/profile/67351f7204c12f7542f2e9cd",
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

    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Render a single post item
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image
        source={{
          uri: BACKEND + "/" + item.imageUrl, // Make sure to use the full URL
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
        {profile ? (
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri: profile.profilePicture
                    ? BACKEND + "/" + profile.profilePicture // Full URL for profile picture
                    : "https://via.placeholder.com/100", // Placeholder if no profile picture
                }}
                style={styles.profilePicture}
              />
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.description}>
                {profile.description || "No description provided"}
              </Text>
            </View>

            {/* Posts */}
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
    flexDirection: "row", // Align caption and likes in a row
    justifyContent: "space-between", // Space between caption and likes
    alignItems: "center", // Center align items vertically
    marginTop: 10,
  },
  postCaption: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1, // Let caption take available space
    marginRight: 10, // Add spacing between caption and likes
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
