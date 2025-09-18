import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/register", { username, email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user_id", res.data.user.id.toString());
      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Auth");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Register" onPress={handleRegister} />
        <Text style={styles.note} onPress={() => navigation.navigate("Auth")}>
            Already have an account? Login
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,             // allow ScrollView to grow
    justifyContent: "center", // center content vertically
  },
  container: { padding: 20 },
  label: { fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
});
