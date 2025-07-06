import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { UserContext } from '../../context/UserContext'; // adjust path if needed

export default function AttendanceScreen() {
  const { user } = useContext(UserContext);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!user?.email) {
      Alert.alert('Not logged in', 'Please log in before checking in.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Code must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const codeRes = await fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a');
      const codeData = await codeRes.json();
      const matched = codeData.find(item => item.attendance_code === code);

      if (!matched) {
        Alert.alert('❌ Invalid Code', 'This code was not found.');
        return;
      }

      const earnedHours = parseFloat(matched.duration_hours || 0);

      const attendanceEntry = {
        email: user.email,
        date: matched.date,
        event_name: matched.event_name,
        hours: matched.duration_hours,
      };

      await fetch('https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceEntry),
      });

      const eventRes = await fetch(`https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c?email=${encodeURIComponent(user.email)}`);
      const userEvents = await eventRes.json();
      const totalHours = userEvents.reduce((sum, item) => sum + parseFloat(item.hours || 0), 0);

      Alert.alert(
        '✅ Success',
        `You earned ${earnedHours} volunteer hours for "${matched.event_name}".\nTotal hours: ${totalHours}`
      );

      setCode('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
});
