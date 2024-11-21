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
import getToken from "../../../utils/tokenHandler";

export default function HomeScreen() {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle like button press
  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const renderPost = ({ item }) => {
    return (
      <View key={"MainView-" + item._id} style={styles.postContainer}>
        <Text key={"Username-" + item._id} style={styles.userText}>
          {item.user.username}
        </Text>

        <Image
          key={"image-" + item._id}
          source={{ uri: BACKEND + "/" + item.imageUrl }}
          style={styles.image}
        />

        <View key={"actions-" + item._id} style={styles.actionsContainer}>
          <TouchableOpacity
            key={"like-" + item._id}
            onPress={() => handleLike(item.id)}
          >
            <Text key={"likeButton-" + item._id} style={styles.likeButton}>
              ❤️ Like
            </Text>
          </TouchableOpacity>
          <Text key={"likesAmount-" + item._id} style={styles.likeCount}>
            {item.likes} likes
          </Text>
        </View>

        <Text key={"captionText-" + item._id} style={styles.caption}>
          <Text key={"captionUsername-" + item._id} style={styles.userText}>
            {item.user.username}{" "}
          </Text>
          <Text key={"caption-" + item._id}>{item.caption}</Text>
        </Text>
      </View>
    );
  };

  useEffect(() => {
    const getFeed = async () => {
      const TOKEN = await getToken();

      try {
        const response = await fetch(BACKEND + "/api/posts/feed", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getFeed();
  }, [isLoading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
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
