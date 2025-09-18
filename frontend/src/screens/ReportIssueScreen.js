import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function ReportIssueScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow access to media library");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow access to camera");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access");
      return null;
    }
    const loc = await Location.getCurrentPositionAsync({});
    return loc.coords;
  };

  const handleSubmit = async () => {
  if (!image || !description) {
    Alert.alert("Error", "Please provide image and description");
    return;
  }

  const coords = await getLocation();
  if (!coords) return;

  console.log("Sending image:", image);

  const formData = new FormData();

  // Detect if running in web vs native
  if (image.startsWith('blob:')) {
    // Web case: convert blob to File
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], "issue.jpg", { type: blob.type });

    formData.append("image", file);
  } else {
    // Native case: use local file URI
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "issue.jpg",
    });
  }

  formData.append("description", description);
  formData.append("latitude", coords.latitude);
  formData.append("longitude", coords.longitude);
  formData.append("user_id", await AsyncStorage.getItem("user_id"));

  try {
    const token = await AsyncStorage.getItem("token");
    await API.post("/issues/report", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type manually
      },
    });

    Alert.alert("Success", "Issue reported successfully");
    navigation.navigate("Dashboard", { refresh: true });
    
  } catch (err) {
    console.log(err.response?.data || err);
    Alert.alert("Error", err.response?.data?.message || "Server Error");
  }
};


  return (
    <View style={styles.container}>
      <Button title="Capture Image" onPress={captureImage} />
      <Button title="Select Image from Gallery" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Submit Issue" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 15,
    borderRadius: 5,
  },
  preview: {
    width: "100%",
    height: 200,
    marginVertical: 15,
  },
});
