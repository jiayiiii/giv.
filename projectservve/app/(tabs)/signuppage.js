import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    class: '',
    contact: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const url = 'https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c';

    if (!form.name || !form.email || !form.password) {
      Alert.alert('Missing Info', 'Name, Email, and Password are required.');
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Alert.alert('Success', 'You have signed up successfully!');
        setForm({ name: '', email: '', password: '', role: '', class: '', contact: '' });
        navigation.navigate('home');
      } else {
        Alert.alert('Error', 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Check your internet connection.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={text => handleChange('name', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={text => handleChange('email', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={text => handleChange('password', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Role (e.g. Student/student council etc.)"
          value={form.role}
          onChangeText={text => handleChange('role', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Class"
          value={form.class}
          onChangeText={text => handleChange('class', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={form.contact}
          onChangeText={text => handleChange('contact', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: '#f0f0f8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#847ed6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#847ed6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
