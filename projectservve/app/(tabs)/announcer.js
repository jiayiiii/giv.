import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const announcer = [
  {
    email: "tom_tan@gmail.com",
    name: "Talk about SIP",
    date: "2025-06-18",
    time: "14:00",
    duration: { hours: 1, minutes: 30 },
    description: "SIP is a studnet initaed prokect",
    limit: 10,
    parentApproval: false,
    Filters: ["Everyone"],
    category: "Community",
  },
  {
    email: "sip_coordinator@school.edu",
    name: "timetable",
    date: "2025-07-05",
    time: "14:00",
    duration: { hours: 2, minutes: 0 },
    description: "Learn how to plan your own timetable",
    limit: 40,
    parentApproval: false,
    Filters: ["Secondary 3-5"],
    category: "Education",
  },
  {
    email: "student_council@school.edu",
    name: "How to Launch Your Own Student-Initiated Learning",
    date: "2025-07-12",
    time: "16:00",
    duration: { hours: 1, minutes: 30 },
    description: "how to start ur own SIP porject?",
    limit: 50,
    parentApproval: false,
    Filters: ["All Students"],
    category: "Education",
  },
];

export default function Index() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Announcements</Text>
        <Text style={styles.subheader}>What's new?</Text>
        {announcer.map((opportunity, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.name}>{opportunity.name}</Text>
            <Text style={styles.info}>Date: {opportunity.date}</Text>
            <Text style={styles.info}>Time: {opportunity.time}</Text>
            <Text style={styles.info}>
              Duration: {opportunity.duration.hours} hour{opportunity.duration.hours !== 1 ? "s" : ""} {opportunity.duration.minutes} minutes
            </Text>
            <Text style={styles.description}>{opportunity.description}</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 8,
  },
});
