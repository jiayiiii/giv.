import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const opportunities = [
  {
    email: "contact@beachcleanup.org",
    name: "Beach Cleanup!!!",
    date: "2025-06-15",
    time: "10:00",
    duration: { hours: 2, minutes: 0 },
    description: "Help clean up the a very dirty beach :( .",
    limit: 20,
    parentApproval: true,
    Filters: ["Upper Secondary", "Teachers"],
    category: "Environment",
  },
  {
    email: "tom_tan@gmail.com",
    name: "Relay 4 Life",
    date: "2025-06-18",
    time: "14:00",
    duration: { hours: 1, minutes: 30 },
    description: "Assist with sorting and distributing food.",
    limit: 10,
    parentApproval: false,
    Filters: ["Everyone"],
    category: "Community",
  },
]

export default function Index() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Hi, user!</Text>
        <Text style={styles.subheader}>Volunteering Opportunities</Text>
          {opportunities.map((opportunity, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.name}>{opportunity.name}</Text>
              <Text style={styles.info}>Date: {opportunity.date}</Text>
              <Text style={styles.info}>Time: {opportunity.time}</Text>
              <Text style={styles.info}>Duration: {opportunity.duration.hours} hour{opportunity.duration.hours !== 1 ? "s" : ""} {opportunity.duration.minutes} minutes</Text>
        </View>
            ))}
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
  card: {
    backgroundColor: '#f3f3fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d284d',
    marginBottom: 4,
  },
});