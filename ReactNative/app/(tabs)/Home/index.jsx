import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const samplePosts = [
  {
    id: "1",
    user: "johndoe",
    imageUrl:
      "https://cdn.pixabay.com/photo/2024/01/17/12/06/car-8514314_640.png",
    caption: "Look at this cute kitten!",
    likes: 100,
  },
  {
    id: "2",
    user: "janedoe",
    imageUrl:
      "https://cdn.pixabay.com/photo/2024/01/17/12/06/car-8514314_640.png",
    caption: "Another adorable cat!",
    likes: 250,
  },
  {
    id: "3",
    user: "janedoe2",
    imageUrl:
      "https://cdn.pixabay.com/photo/2024/01/17/12/06/car-8514314_640.png",
    caption: "Another adorable cat!",
    likes: 252,
  },
  // Add more posts here
];

export default function HomeScreen() {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [posts, setPosts] = useState(samplePosts);

  // Function to handle like button press
  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.userText}>{item.user}</Text>

      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text style={styles.likeButton}>❤️ Like</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes} likes</Text>
      </View>

      <Text style={styles.caption}>
        <Text style={styles.userText}>{item.user} </Text>
        {item.caption}
      </Text>
    </View>
  );

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await fetch(BACKEND + "/api/posts/feed", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzI4MjBiZDFjMDRiYjJhMTAyZjYzNyIsImlhdCI6MTczMTM2MzQxNiwiZXhwIjoxNzMzOTU1NDE2fQ.qX6q94MieuxsMe2kyjVJQIgshhEJLFnuslav4m1b_H8`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Feed fetched:", data);
        // setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        // setLoading(false);
      }
    };

    getFeed();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.feed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  feed: {
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  userText: {
    fontWeight: "bold",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  likeButton: {
    fontSize: 16,
    color: "#ff3333",
    marginRight: 10,
  },
  likeCount: {
    fontSize: 16,
  },
  caption: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
});
