import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function AttendanceScreen() {
  const [code, setCode] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Code must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a'
      );
      const data = await response.json();

      const matchedEntry = data.find(
        item => item.attendance_code === code
      );

      if (matchedEntry) {
        const hours = parseFloat(matchedEntry.duration_hours);
        setTotalHours(prev => prev + hours);
        Alert.alert('✅ Success', `You earned ${hours} volunteer hours!`);
        setCode('');
      } else {
        Alert.alert('❌ Invalid Code', 'This code was not found.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to connect to the attendance system.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Attendance</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#999' }]}
        onPress={handleCheckIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : 'Submit Code'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.hoursText}>Total Hours: {totalHours}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hoursText: {
    fontSize: 18,
  },
});
