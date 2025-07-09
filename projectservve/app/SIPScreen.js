import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SIPScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/SIP.jpeg')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    borderRadius: 12,
  },
});
