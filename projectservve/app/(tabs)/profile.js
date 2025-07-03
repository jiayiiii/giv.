import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserContext } from '../UserContext';

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c?email=${encodeURIComponent(
            user.email
          )}`
        );
        const data = await res.json();
        setProfile(data[0] || null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c?email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json();
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchProfile();
    fetchEvents();
  }, [user]);

  const totalHours = events.reduce(
    (sum, item) => sum + parseFloat(item.hours || 0),
    0
  );

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👤 Profile</Text>

      {loadingProfile ? (
        <ActivityIndicator size="large" color="#aaa" />
      ) : profile ? (
        <View style={styles.card}>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Contact: {profile.contact}</Text>
          <Text>Class: {profile.class}</Text>
          <Text>Role: {profile.role}</Text>
        </View>
      ) : (
        <Text>No profile data found.</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Events Attended</Text>

        {loadingEvents ? (
          <ActivityIndicator size="large" color="#aaa" />
        ) : events.length === 0 ? (
          <Text>No events found for this account.</Text>
        ) : (
          <>
            <View style={styles.eventHeader}>
              <Text style={styles.eventCol}>Date</Text>
              <Text style={styles.eventCol}>Event</Text>
              <Text style={styles.eventCol}>Hours</Text>
            </View>

            {events.map((event, index) => (
              <View key={index} style={styles.eventRow}>
                <Text style={styles.eventCol}>{event.date}</Text>
                <Text style={styles.eventCol}>{event.event_name}</Text>
                <Text style={styles.eventCol}>{event.hours}</Text>
              </View>
            ))}

            <Text style={styles.totalText}>Total: {totalHours} hours</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={{ marginTop: 30, alignSelf: 'flex-end' }}
        onPress={handleLogout}
      >
        <Text style={{ color: 'orange', fontWeight: 'bold' }}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  section: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  eventCol: { flex: 1, textAlign: 'center' },
  totalText: { marginTop: 15, fontWeight: 'bold', fontSize: 16 },
});
