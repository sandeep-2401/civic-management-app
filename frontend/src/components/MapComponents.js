// src/components/MapComponent.js
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapComponent({ locations }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: locations[0]?.latitude || 10.0,
        longitude: locations[0]?.longitude || 76.0,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
    >
      {locations.map((loc, idx) => (
        <Marker
          key={idx}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title={loc.description}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: 300, borderRadius: 8 },
});
