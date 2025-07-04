import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
  const { opportunity } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{opportunity["Name of your volunteering opportunity"]}</Text>
      <Text>Email: {opportunity["Email to contact for more details"]}</Text>
      <Text>Date: {opportunity.date}</Text>
      <Text>Time: {opportunity.time}</Text>
      <Text>Description: {opportunity.Description}</Text>
      <Text>Category: {opportunity.Category}</Text>
      <Text>Limit: {opportunity["Limit of People (put only integers with no spaces)"]}</Text>
      <Text>Duration: {opportunity.duration_hours} hour(s)</Text>
      <Text>Parent Approval: {opportunity["Parents approval required?"]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
