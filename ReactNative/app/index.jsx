import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validateToken from "../utils/tokenHandler";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginPage = () => {
  const navigation = useNavigation();
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND}/api/auth/login`, {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Fakestagram</Text>
        {register ? (
          <RegisterPage />
        ) : (
          <>
            <View>
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
              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : (
                <Button title="Login" onPress={handleLogin} />
              )}
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
          </>
        )}
        <TouchableOpacity onPress={() => setRegister(!register)}>
          <Text style={styles.link}>{register ? "Already have an account? Login here" : "Create account here"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const RegisterPage = () => {
  const navigation = useNavigation();
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registrado exitosamente!");
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Error en el servidor. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <Button title="Register" onPress={handleRegister} />
        )}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  link: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginPage;
