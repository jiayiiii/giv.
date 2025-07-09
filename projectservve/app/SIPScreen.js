import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

export default function SIPScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <Image source={require('../assets/images/SIP.jpeg')} style={styles.image} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  image: {
    width: '130%',
    height: 1500,
    resizeMode: 'contain',
    borderRadius: 12,
  },
});
