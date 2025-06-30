import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation(); // ✅ this gives access to .navigate()
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then(res => res.json())
      .then(setOpportunities)
      .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Hi, user!</Text>
        <Text style={styles.subheader}>Volunteering Opportunities</Text>

        {opportunities.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            onPress={() => navigation.navigate('Details', { opportunity: item })}
          >
            <Text style={styles.name}>{item["Name of your volunteering opportunity"]}</Text>
            <Text style={styles.info}>Date: {item.date}</Text>
            <Text style={styles.info}>Time: {item.time}</Text>
            <Text style={styles.info}>Category: {item.Category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingVertical: 24, paddingHorizontal: 20 },
  header: { fontSize: 38, fontWeight: '700', color: 'black', marginBottom: 6 },
  subheader: { fontSize: 24, color: '#2d284d', fontWeight: '500', marginBottom: 16 },
  card: { backgroundColor: '#f3f3fa', borderRadius: 10, padding: 16, marginBottom: 16 },
  info: { fontSize: 16, color: '#444', marginBottom: 2 },
  name: { fontSize: 20, fontWeight: '600', color: '#2d284d', marginBottom: 4 },
});
