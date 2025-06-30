import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function SheetScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sheet Data</Text>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {Object.entries(item).map(([key, value]) => (
              <Text key={key} style={styles.text}>{key}: {value}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  text: { fontSize: 14 }
});
