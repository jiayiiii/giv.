import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, FlatList } from 'react-native';

const ProfileScreen = () => {
  const volunteerData = [
    { date: '28 April 2025', volunteer: 'Relay For Life', status: 'ACCEPTED', hours: 5 },
    { date: '5 April 2025', volunteer: 'Youth.sg', status: 'PENDING', hours: 10 },
  ];

  const totalHours = volunteerData
    .filter(item => item.status === 'ACCEPTED')
    .reduce((sum, item) => sum + item.hours, 0);

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
    
      <View style={{ borderWidth: 1, borderRadius: 10, padding: 16, backgroundColor: '#f9f9f9' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
          <TouchableOpacity>
            <Text style={{ color: 'orange', fontWeight: 'bold' }}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text>Name: John Pork</Text>
        <Text>Age: 13</Text>
        <Text>Email: john_pork@s2030.ssts.edu.sg</Text>
        <Text>Contact number: +65 1234 5678</Text>


        <Text style={{ marginTop: 10 }}>Skills:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 }}>
          {['Arts', 'Sports', 'Technology'].map(skill => (
            <TouchableOpacity
              key={skill}
              style={{
                borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text>{skill}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18 }}>Data:</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>＋</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 10 }}>
      
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <Text style={{ flex: 2, fontWeight: 'bold' }}>Date</Text>
            <Text style={{ flex: 2, fontWeight: 'bold' }}>Volunteer</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Accepted?</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Hours</Text>
          </View>

          {volunteerData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', paddingVertical: 6 }}>
              <Text style={{ flex: 2 }}>{item.date}</Text>
              <Text style={{ flex: 2 }}>{item.volunteer}</Text>
              <Text style={{ flex: 1 }}>[{item.status}]</Text>
              <Text style={{ flex: 1 }}>{item.hours}</Text>
            </View>
          ))}
        </View>

        <Text style={{ marginTop: 10 }}>
          Total: {totalHours} hours
        </Text>
        <Text style={{ marginTop: 2 }}>
          Requirements for NYAA and LEAPS:
        </Text>
        <Text>nyaa - bronze : 24 hours</Text>
      </View>

      <TouchableOpacity style={{ marginTop: 30, alignSelf: 'flex-end' }}>
        <Text style={{ color: 'orange', fontWeight: 'bold' }}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;