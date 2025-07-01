import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,KeyboardAvoidingView,Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ setUser }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter email and password.');
      return;
    }

    try {
      const res = await fetch('https://api.sheetbest.com/sheets/5a227262-33c1-47fa-a91e-da4b0fae953c');
      const data = await res.json();

      const matchedUser = data.find(user =>
        user.email?.toLowerCase() === email.toLowerCase() &&
        user.password === password
      );

      if (matchedUser) {
        Alert.alert('Welcome!', `Logged in as ${matchedUser.name}`);
        setUser(matchedUser); 
        navigation.navigate('home');
      } else {
        Alert.alert('Invalid Credentials', 'Email or password is incorrect.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch. Try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20, paddingTop: 100 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30 },
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
