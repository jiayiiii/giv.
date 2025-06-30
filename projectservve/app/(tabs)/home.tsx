import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>hi, user! 👋</Text>
        <View>
        
        </View>
        <Text style={styles.subheader}>volunteering opportunities</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 38,
    fontWeight: '700',
    color: 'black',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 24,
    color: '#2d284d',
    fontWeight: '500',
    marginBottom: 16,
  },
});
