export const options = {
  headerBackTitleVisible: false,
  headerTitle: 'Details', 
};

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Details() {
  const params = useLocalSearchParams();

  

  
  let opportunity = {};
  try {
    opportunity = params.opportunity
      ? JSON.parse(params.opportunity)
      : {};
  } catch (e) {
    opportunity = {};
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{opportunity["Name of your volunteering opportunity"] || "No Title"}</Text>
      <Text>Email: {opportunity["Email to contact for more details"] || "N/A"}</Text>
      <Text>Date: {opportunity.date || "N/A"}</Text>
      <Text>Time: {opportunity.time || "N/A"}</Text>
      <Text>Description: {opportunity.Description || "N/A"}</Text>
      <Text>Category: {opportunity.Category || "N/A"}</Text>
      <Text>Limit: {opportunity["Limit of People (put only integers with no spaces)"] || "N/A"}</Text>
      <Text>Duration: {opportunity.duration_hours ? `${opportunity.duration_hours} hour(s)` : "N/A"}</Text>
      <Text>Parent Approval: {opportunity["Parents approval required?"] || "N/A"}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});