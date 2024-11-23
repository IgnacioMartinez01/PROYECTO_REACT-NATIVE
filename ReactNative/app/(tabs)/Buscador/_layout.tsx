import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";

const BuscadorLayout = () => {
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

export default BuscadorLayout;
