import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import API from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const [counts, setCounts] = useState({});
  const [lineData, setLineData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [topReporters, setTopReporters] = useState([]);
  const [avgTime, setAvgTime] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const countsRes = await API.get('/statistics/counts');
      setCounts(countsRes.data);

      const perDayRes = await API.get('/statistics/perday');
      setLineData({
        labels: perDayRes.data.map(d => d.date),
        datasets: [{ data: perDayRes.data.map(d => parseInt(d.count)) }],
      });

      const topRes = await API.get('/statistics/top-reporters');
      setTopReporters(topRes.data);

      const avgRes = await API.get('/statistics/avg-resolution');
      setAvgTime(parseFloat(avgRes.data.avg_hours).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Issue Counts */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statTitle}>Total</Text><Text style={styles.statValue}>{counts.total || 0}</Text></View>
        <View style={styles.statCard}><Text style={styles.statTitle}>Resolved</Text><Text style={styles.statValue}>{counts.resolved || 0}</Text></View>
        <View style={styles.statCard}><Text style={styles.statTitle}>In Progress</Text><Text style={styles.statValue}>{counts.in_progress || 0}</Text></View>
        <View style={styles.statCard}><Text style={styles.statTitle}>Avg. Time (hrs)</Text><Text style={styles.statValue}>{avgTime}</Text></View>
      </View>

      {/* Line Chart */}
      <Text style={styles.sectionTitle}>Issues Per Day</Text>
      <LineChart
        data={lineData}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#f0f4f7',
          backgroundGradientFrom: '#f0f4f7',
          backgroundGradientTo: '#f0f4f7',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: () => '#555',
          style: { borderRadius: 8 },
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#007AFF' },
        }}
        style={{ marginVertical: 10, borderRadius: 8 }}
      />

      {/* Top Reporters */}
      <Text style={styles.sectionTitle}>Top Reporters</Text>
      <FlatList
        data={topReporters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text style={styles.userName}>{item.username}</Text>
            <Text>{item.issues_reported} issues</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, flexWrap: 'wrap' },
  statCard: { backgroundColor: '#e3f2fd', padding: 15, borderRadius: 10, width: '48%', marginBottom: 10 },
  statTitle: { fontSize: 14, color: '#555' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  userName: { fontWeight: 'bold' },
});
