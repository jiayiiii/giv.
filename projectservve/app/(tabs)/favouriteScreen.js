import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FavouritesScreen({ route }) {
  const navigation = useNavigation();
  const [bookmarked, setBookmarked] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((item) => {
          const [datePart, timePart] = (item.Timestamp || '').split(' ');
          if (!datePart || !timePart) return null;
          const [month, day, year] = datePart.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return {
            ...item,
            date: `${month}/${day}/${year}`,
            parsedTimestamp: date,
          };
        }).filter(Boolean);

        setOpportunities(parsed);
        setLoading(false);
      });
  }, []);

  useEffect(() => {

    setBookmarked([]);
  }, []);

  const bookmarkedOpportunities = opportunities.filter((item) =>
    bookmarked.includes(item["Name of your volunteering opportunity"])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#847ed6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Starred Opportunities</Text>
      {bookmarkedOpportunities.length === 0 ? (
        <Text style={styles.noResults}>No favourites yet.</Text>
      ) : (
        bookmarkedOpportunities.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            onPress={() => {
              const { parsedTimestamp, ...serializableItem } = item;
              navigation.navigate('Details', { opportunity: JSON.stringify(serializableItem) });
            }}
          >
            <Text style={styles.name}>{item["Name of your volunteering opportunity"]}</Text>
            <Text style={styles.info}>Date: {item.date || 'N/A'}</Text>
            <Text style={styles.info}>Time: {item.time || 'N/A'}</Text>
            <Text style={styles.info}>Category: {item.Category || 'N/A'}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#3a3a3a',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    paddingTop: 25,
    marginBottom: 15,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontWeight: '800',
    fontSize: 20,
    color: '#3a3a3a',
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
