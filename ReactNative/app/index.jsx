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
import { SafeAreaView } from "react-native-safe-area-context";
import getToken from "../utils/tokenHandler";

const LoginPage = () => {
  const navigation = useNavigation();
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  const validateToken = async ()=>{
    const TOKEN = await getToken()

    if(TOKEN[0] == "e") {
      navigation.replace("(tabs)");
    }
  }

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
            <View style= {{width:"100%", alignItems: "center"}}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"#888"}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor={"#888"}
              />
              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : (
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

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
          placeholderTextColor={"#888"}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor={"#888"}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={"#888"}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    textTransform: "uppercase",
    color: "#BD61DE",
    fontFamily: "Moul", "SansSerif": "Moul",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: "90%",
    fontSize: 16,
    backgroundColor: "#f5f5f5", 
  },
  button: {
    width: "90%",
    padding: 15,
    backgroundColor: "#BD61DE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginPage;