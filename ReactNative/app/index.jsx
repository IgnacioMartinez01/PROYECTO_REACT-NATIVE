import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validateToken from "../utils/tokenHandler";

const LoginPage = () => {
  const navigation = useNavigation();

  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const redirectRegister = () => {
    navigation.navigate("Home");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        await AsyncStorage.setItem("authToken", token);
        console.log("Login exitoso:", data);
        navigation.replace("(tabs)");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error en el servidor. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Fakestagram</Text>
        <View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, padding: 10 }}
          />
          <Button
            title={loading ? "Cargando..." : "Login"}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
        <TouchableOpacity onPress={redirectRegister}>
          <Text style={{ marginTop: 10 }}>Create account here</Text>
        </TouchableOpacity>
        {!!error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    </>
  );
};

export default LoginPage;

