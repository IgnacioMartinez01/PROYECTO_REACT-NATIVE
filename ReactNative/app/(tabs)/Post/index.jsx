import React, { useState, useEffect } from "react";
import { Button, Image, View, Text, TextInput, StyleSheet, SafeAreaView, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card } from '@rneui/themed';

export default function ImageGallery() {

  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Necesitas darnos permisos para acceder a la cámara");
      }
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const publishPost = async () => {

    console.log("Imagen:", image);
    console.log("Descripción:", description);

    const TOKEN = await getToken();
    if (image && description) {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg", 
        name: `photo_${Date.now()}.jpg`,
      });
      formData.append("caption", description);
  
      try {
        const response = await fetch(BACKEND + `/api/posts/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer` + TOKEN,
          },
          body: formData,
        });
  
        if (response.ok) {
          const newPost = await response.json();
          setPosts([newPost, ...posts]);
          setImage("");
          setDescription("");
          alert("¡Publicación exitosa!");
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error al publicar. Por favor, intenta nuevamente.");
      }
    } else {
      alert("Por favor, selecciona una imagen y agrega una descripción.");
    }
  };
  

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.Card}>
        <Button title="Seleccionar imagen de la galería" onPress={pickImageFromLibrary} />
        <Button title="Tomar una foto" onPress={takePhoto} />
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

          <TextInput
          placeholder="Descripción de la imagen"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        
        <Button title="Publicar" onPress={publishPost} />

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          style={styles.postList}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  postList: {
    marginTop: 20,
  },
  postContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  postImage: {
    width: 200,
    height: 200,
  },
  postDescription: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  
});
