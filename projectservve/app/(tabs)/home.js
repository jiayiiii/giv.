import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
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
  ];

  const [selectedBoardFilter, setSelectedBoardFilter] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const onDateChange = (event, date) => {
    if (event.type !== 'dismissed') {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  useEffect(() => {
    let filtered = opportunities;

    if (selectedBoardFilter) {
      if (selectedBoardFilter === 'Others') {
        const knownBoards = boardFilters.filter(b => b !== 'Others');
        filtered = filtered.filter(op => {
          const val = (op.Filters || '').toLowerCase();
          return !knownBoards.some(b => val.includes(b.toLowerCase()));
        });
      } else {
        filtered = filtered.filter(op =>
          (op.Filters || '').toLowerCase().includes(selectedBoardFilter.toLowerCase())
        );
      }
    }

    if (selectedCategoryFilter) {
      filtered = filtered.filter(op =>
        (op.Category || '').toLowerCase().includes(selectedCategoryFilter.toLowerCase())
      );
    }

    if (selectedDate) {
      const filterDateStr = formatDate(selectedDate);
      filtered = filtered.filter(op => op.date === filterDateStr);
    }

    setFilteredData(filtered);
  }, [selectedBoardFilter, selectedCategoryFilter, selectedDate, opportunities]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Volunteering Opportunities</Text>

      <View style={styles.filterBox}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterText}>
            Filters
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.sectionLabel}>Filter by Board / Group</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {boardFilters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedBoardFilter === filter && styles.filterButtonSelected,
                ]}
                onPress={() =>
                  setSelectedBoardFilter(selectedBoardFilter === filter ? null : filter)
                }
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
                onPress={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === filter ? null : filter)
                }
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

          <View style={styles.datePickerBack}>
            <Text style={styles.sectionLabel}>Filter by Date</Text>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={{ fontSize: 16, color: selectedDate ? '#333' : '#aaa' }}>
                {selectedDate ? formatDate(selectedDate) : 'Select a date'}
              </Text>
            </TouchableOpacity>

            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateButton}>
                <Text style={styles.clearDateText}>Clear Date</Text>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                onChange={onDateChange}
              />
            )}
          </View>
        </View>
      )}


      <View style={styles.list}>
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
              <Text style={styles.info}>Filters: {item.Filters || item.Category || 'N/A'}</Text>
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
    paddingTop: 50,
  },
  filterBox: {
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  filterButton: {
    backgroundColor: '#847ed6',
    paddingTop: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#847ed6',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filters: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  datePickerBox: {
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
  clearDateButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearDateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    paddingTop: 25,
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
