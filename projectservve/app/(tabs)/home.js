import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeScreen({ navigation }) {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const boardFilters = [
    'Student Council',
    'Peer Support Board',
    'ACE',
    'House CCA Leaders',
    'Upper Secondary',
    'Lower Secondary',
    'Teachers',
    'Everyone',
    'Others',
  ];

  const categoryFilters = [
    'Elderly',
    'Children',
    'Animal Welfare',
    'Family',
    'Healthcare',
    'Environmental',
    'Community Service',
    'All',
  ];

  const [selectedBoardFilter, setSelectedBoardFilter] = useState('Everyone');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [parentApprovalFilter, setParentApprovalFilter] = useState('Yes');

  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then(res => res.json())
      .then(data => {
        setOpportunities(data);
        setFilteredData(data);
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return null;
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    let filtered = opportunities;

    if (selectedBoardFilter !== 'Everyone') {
      if (selectedBoardFilter === 'Others') {
        const knownBoards = boardFilters.filter(b => b !== 'Everyone' && b !== 'Others');
        filtered = filtered.filter(op => {
          const filterVal = (op.Filters || op.Category || '').toLowerCase();
          return !knownBoards.some(b => filterVal.includes(b.toLowerCase()));
        });
      } else {
        filtered = filtered.filter(op => {
          const filterVal = (op.Filters || op.Category || '').toLowerCase();
          return filterVal.includes(selectedBoardFilter.toLowerCase());
        });
      }
    }

    if (selectedCategoryFilter !== 'All') {
      filtered = filtered.filter(op => {
        const catVal = (op.Category || '').toLowerCase();
        return catVal.includes(selectedCategoryFilter.toLowerCase());
      });
    }

    // Strict filter for parents approval yes/no
    filtered = filtered.filter(op => {
      const approval = (op["Parents approval required?"] || '').toLowerCase();
      return approval === parentApprovalFilter.toLowerCase();
    });

    if (selectedDate) {
      const filterDateStr = formatDate(selectedDate);
      filtered = filtered.filter(op => op.date === filterDateStr);
    }

    setFilteredData(filtered);
  }, [selectedBoardFilter, selectedCategoryFilter, parentApprovalFilter, selectedDate, opportunities]);

  // Fix for Android dismissal behavior
  const onDateChange = (event, selected) => {
    if (event.type === 'set') {
      setSelectedDate(selected);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Volunteering Opportunities</Text>

      <Text style={styles.sectionLabel}>Filter by Board / Group</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {boardFilters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedBoardFilter === filter && styles.filterButtonSelected,
            ]}
            onPress={() => setSelectedBoardFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedBoardFilter === filter && styles.filterTextSelected,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>Filter by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {categoryFilters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedCategoryFilter === filter && styles.filterButtonSelected,
            ]}
            onPress={() => setSelectedCategoryFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategoryFilter === filter && styles.filterTextSelected,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Parents Approval Required?</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={parentApprovalFilter}
            onValueChange={setParentApprovalFilter}
            style={styles.picker}
            dropdownIconColor="#847ed6"
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Filter by Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={{ fontSize: 16, color: selectedDate ? '#333' : '#aaa' }}>
            {selectedDate ? formatDate(selectedDate) : 'Select a date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.listContainer}>
        {filteredData.length === 0 ? (
          <Text style={styles.noResults}>No opportunities found.</Text>
        ) : (
          filteredData.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => navigation.navigate('Details', { opportunity: item })}
              activeOpacity={0.8}
            >
              <Text style={styles.name}>{item["Name of your volunteering opportunity"]}</Text>
              <Text style={styles.info}>Date: {item.date}</Text>
              <Text style={styles.info}>Time: {item.time}</Text>
              <Text style={styles.info}>Category: {item.Category}</Text>
              <Text style={styles.info}>Parents Approval: {item["Parents approval required?"]}</Text>
              <Text style={styles.info}>Board/Filters: {item.Filters || item.Category || 'N/A'}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3a3a3a',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#e0e0f7',
    borderRadius: 25,
    marginRight: 12,
    shadowColor: '#847ed6',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  filterButtonSelected: {
    backgroundColor: '#847ed6',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  datePickerContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#e7e7fa',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 15,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontWeight: '800',
    fontSize: 20,
    color: '#3a3a3a',
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  noResults: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    marginTop: 40,
    fontSize: 18,
  },
});
