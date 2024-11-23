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
import formatDate from "../../../utils/timeHelper";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { useFocusEffect } from "expo-router";
import { jwtDecode } from "jwt-decode";

export default function HomeScreen() {
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [userId, setUserId] = useState();
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const heartAnimationRef = React.useRef(null);

  // TODO: Implement like functionality
  const handleLike = async (post) => {
    console.log(post);
    const TOKEN = await getToken();
    
    if (!post.likes.includes(userId)) {
      heartAnimationRef.current.bounceIn();
      try {
        const response = await fetch(BACKEND + "/api/posts/" + post._id + "/like", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + TOKEN,
          },
        });

        console.log(response);
      
        setIsLoading(true)
        getFeed();
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
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

        <View style={styles.likeRow}>
          <TouchableOpacity onPress={() => handleLike(item)}>
            <Animatable.View ref={heartAnimationRef}>
              <Icon
                name={item.likes.includes(userId) ? "heart" : "heart-o"}
                size={28}
                color={item.likes.includes(userId) ? "#FF0000" : "#000"}
              />
            </Animatable.View>
          </TouchableOpacity>
          <Text style={styles.postLikes}>
          {item.likes.length}
          </Text>
        </View>

        <View style={styles.captionLikesRow}>
          <Text style={styles.postCaption}>{item.caption}</Text>
          <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  const getFeed = async () => {
    const TOKEN = await getToken();
    const decoded = await jwtDecode(TOKEN);
    setUserId(decoded?.id);

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

  useEffect(() => {
    getFeed();
  }, [isLoading]);

  useFocusEffect(
    React.useCallback(() => {
      getFeed();
    }, [])
  );

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
    padding: 5,
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
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likeCount: {
    fontSize: 16,
  },
  caption: {
    paddingHorizontal: 10,
    fontSize: 14,
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
    fontSize: 20,
    color: "gray",
    marginLeft: 10,
  },
  likeButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  likeButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  liked: {
    backgroundColor: "#FF0000",
    color: "#fff",
  },
  postDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
