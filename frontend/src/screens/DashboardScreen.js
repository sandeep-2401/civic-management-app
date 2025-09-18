import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function DashboardScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserAndReports = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
      if (id) fetchReports(id);
    };
    loadUserAndReports();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) fetchReports(userId);
    });

    return unsubscribe;
  }, [navigation, userId]);

  const fetchReports = async (id) => {
    try {
      const res = await API.get(`/issues/user/${id}`);
      setReports(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch your reports");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "#4CAF50";  // Green
      case "pending": return "#FF9800";   // Orange
      case "in_progress": return "#2196F3"; // Blue
      case "rejected": return "#F44336";  // Red
      default: return "#999";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ReportIssue", { userId })}>
          <Text style={styles.buttonText}>Report New Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Statistics")}>
          <Text style={styles.buttonText}>View Statistics</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Your Reported Issues</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.photo} />
            )}
            <View style={styles.reportInfo}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.loc}>
                📍 Lat: {item.latitude}, Lon: {item.longitude}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  reportCard: { backgroundColor: "#fff", marginBottom: 15, borderRadius: 10, padding: 15, flexDirection: "row", elevation: 3 },
  photo: { width: 100, height: 100, borderRadius: 8, marginRight: 15 },
  reportInfo: { flex: 1 },
  desc: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  loc: { color: "#555", marginBottom: 10 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-start" },
  statusText: { color: "#fff", fontWeight: "bold" },
});
