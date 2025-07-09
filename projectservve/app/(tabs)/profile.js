import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    console.log('Profile page - User data:', user);
    
    if (!user) {
      router.replace('/loginscreen');
      return;
    }
    
    setProfile(user);
    setLoadingProfile(false);

    
    const fetchEvents = () => {
      fetch(`https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          console.log('Events data:', data);
          
          
          const eventData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].event_name && data[i].hours) {
              eventData.push(data[i]);
            }
          }
          setEvents(eventData);
          setLoadingEvents(false);
        })
        .catch(err => {
          console.error('Failed to fetch events:', err);
          setEvents([]);
          setLoadingEvents(false);
        });
    };

    fetchEvents();
  }, [user]);

  let totalHours = 0;
  for (let i = 0; i < events.length; i++) {
    const hours = parseFloat(events[i].hours || 0);
    totalHours = totalHours + hours;
  }

  const handleLogout = () => {
    setUser(null);
  };

  
  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.header}>
          👋 Hi{profile && profile.name ? `, ${profile.name}` : ''}!
        </Text>

          {loadingProfile && <ActivityIndicator size="large" color="#aaa" />}
          
          {!loadingProfile && profile && (
            <View style={styles.card}>
              <Text style={styles.profileText}>
                Name: {profile.name ? profile.name : 'Not provided'}
              </Text>
              <Text style={styles.profileText}>
                Email: {profile.email ? profile.email : 'Not provided'}
              </Text>
              <Text style={styles.profileText}>
                Contact: {profile.contact ? profile.contact : 'Not provided'}
              </Text>
              <Text style={styles.profileText}>
                Class: {profile.class ? profile.class : 'Not provided'}
              </Text>
              <Text style={styles.profileText}>
                Role: {profile.role ? profile.role : 'Not provided'}
              </Text>
            </View>
          )}
          
          {!loadingProfile && !profile && (
            <View style={styles.card}>
              <Text style={styles.noDataText}>No profile data found for this account.</Text>
              <Text style={styles.noDataSubtext}>Make sure your account is properly set up.</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Events Attended</Text>

            {loadingEvents && <ActivityIndicator size="large" color="#aaa" />}
            
            {!loadingEvents && events.length === 0 && (
              <View style={styles.card}>
                <Text style={styles.noDataText}>No events found for this account.</Text>
                <Text style={styles.noDataSubtext}>Your volunteering activities will appear here.</Text>
              </View>
            )}
            
            {!loadingEvents && events.length > 0 && (
              <View>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventCol}>Date</Text>
                  <Text style={styles.eventCol}>Event</Text>
                  <Text style={styles.eventCol}>Hours</Text>
                </View>

                {events.map((event, index) => (
                  <View key={index} style={styles.eventRow}>
                    <Text style={styles.eventCol}>
                      {event.date ? event.date : 'N/A'}
                    </Text>
                    <Text style={styles.eventCol}>
                      {event.event_name ? event.event_name : 'No Name'}
                    </Text>
                    <Text style={styles.eventCol}>
                      {event.hours ? `${event.hours} hrs` : '0 hrs'}
                    </Text>
                  </View>
                ))}

                <Text style={styles.totalText}>Total: {totalHours} hours</Text>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
                    📝 Summary of Events
                  </Text>
                  {events.map((event, index) => (
                    <Text key={index} style={{ marginBottom: 4 }}>
                      • {event.event_name ? event.event_name : 'Unnamed Event'} — {event.hours ? event.hours : '0'} hrs
                    </Text>
                  ))}

                  <Text style={{ marginTop: 10, fontSize: 16 }}>
                    ✅ You attended {events.length} events totaling {totalHours} hours.
                  </Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 15,
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
  profileText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 30,
    alignSelf: 'flex-end',
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
