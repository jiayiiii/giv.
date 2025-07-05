import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventText, setEventText] = useState('');
  const [events, setEvents] = useState({});

  const handleSave = () => {
    if (!selectedDate || !eventText) return;
    setEvents(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), eventText],
    }));
    setEventText('');
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' },
        }}
      />

      {selectedDate ? (
        <View style={styles.eventBox}>
          <Text style={styles.heading}>Add event for {selectedDate}</Text>
          <TextInput
            placeholder="Event..."
            value={eventText}
            onChangeText={setEventText}
            style={styles.input}
          />
          <Button title="Save Event" onPress={handleSave} />

          <Text style={styles.subHeading}>Events:</Text>
          {events[selectedDate]?.map((event, idx) => (
            <Text key={idx} style={styles.eventItem}>• {event}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.info}>Select a date to add/view events.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  eventBox: { marginTop: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subHeading: { fontSize: 16, marginTop: 20, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 10, borderRadius: 6
  },
  eventItem: { fontSize: 16, marginVertical: 2 },
  info: { marginTop: 20, textAlign: 'center', color: 'gray' }
});
