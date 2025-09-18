import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user_id", res.data.user.id.toString());
      navigation.replace("Dashboard");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.toggle}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  toggle: { marginTop: 15, color: "#0066cc", textAlign: "center" },
});
