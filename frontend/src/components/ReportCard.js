import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ReportCard({ report }) {
  return (
    <View style={styles.card}>
      {report.image && <Image source={{ uri: report.image }} style={styles.image} />}
      <Text style={styles.desc}>{report.description}</Text>
      <Text style={styles.status}>Status: {report.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 15, backgroundColor: "#fff", borderRadius: 10, elevation: 2 },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  desc: { fontSize: 16, marginBottom: 5 },
  status: { fontWeight: "bold" },
});
