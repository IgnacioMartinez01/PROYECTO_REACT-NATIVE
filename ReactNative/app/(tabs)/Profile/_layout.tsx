import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slot, Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <View style={styles.container}>
      <Slot /> {/* Cada hijo se renderiza automaticamente con Slot */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ProfileLayout;
