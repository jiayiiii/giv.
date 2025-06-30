import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then(response => response.json())
      .then(data => {
        // Optional: filter out blank rows
        const cleanData = data.filter(item => item["Name of your volunteering opportunity"]);
        setOpportunities(cleanData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Hi, user!</Text>
        <Text style={styles.subheader}>Volunteering Opportunities</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : (
          opportunities.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.name}>{item["Name of your volunteering opportunity"]}</Text>
              <Text style={styles.info}>Date: {item.date}</Text>
              <Text style={styles.info}>Time: {item.time}</Text>
              <Text style={styles.info}>Duration: {item.duration_hours} hour(s)</Text>
              <Text style={styles.info}>Limit: {item["Limit of People (put only integers with no spaces)"]}</Text>
              <Text style={styles.info}>Parent Approval: {item["Parents approval required?"]}</Text>
              <Text style={styles.info}>Filters: {item.Filters}</Text>
              <Text style={styles.info}>Category: {item.Category}</Text>
              <Text style={styles.info}>Contact: {item["Email to contact for more details"]}</Text>
              <Text style={styles.info}>Description: {item.Description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 38,
    fontWeight: '700',
    color: 'black',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 24,
    color: '#2d284d',
    fontWeight: '500',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f3f3fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d284d',
    marginBottom: 4,
  },
});
