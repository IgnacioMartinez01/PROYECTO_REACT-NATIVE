import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validateToken from "../utils/tokenHandler";

const LoginPage = () => {
  const navigation = useNavigation();
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

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

  const redirectRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Text style={styles.iconContent}>📸</Text>
          </View>
        </View>

        <Text style={styles.title}>fakestagram</Text>
        <View style={styles.loginForm}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.textLight}>Create account</Text>
          <Text
            style={styles.textBold}
            onPress={redirectRegister}
          >
            here
          </Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  box: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContent: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loginForm: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textBox: {
    alignItems: "center",
  },
  textLight: {
    color: "#6c757d",
  },
  textBold: {
    color: "#007bff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginPage;
