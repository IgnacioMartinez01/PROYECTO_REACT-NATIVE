import React from "react";
import { Redirect, useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";

const LoginPage = () => {
  const navigation=useNavigation();
  const redirectRegister = () => {
    navigation.navigate("Home");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  /*
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      */

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log(response);
      

      const data = await response.json();

      if (response.ok) {
        const token = data.token; 
        await AsyncStorage.setItem("authToken", token);
        console.log("Login exitoso:", data);
        const navigation = useNavigation();
        navigation.navigate("Home");
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

// obtener token, guardarlo en local storage y mandar al usurio a home
