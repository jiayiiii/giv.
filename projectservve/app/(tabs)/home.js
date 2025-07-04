import { useNavigation } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeScreen() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const boardFilters = [
    'Student Council',
    'Peer Support Board',
    'ACE',
    'House',
    'CCA Leaders',
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
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Helper to parse the timestamp string into Date object
  function parseTimestamp(ts) {
    if (!ts) return null;
    const [datePart, timePart] = ts.split(' ');
    if (!datePart || !timePart) return null;
    const [month, day, year] = datePart.split('/').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  // Format date
  function formatDate(date) {
    if (!date) return '';
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  const fetchOpportunities = useCallback(() => {
    setLoading(true);
    fetch('https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a')
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const parsed = data
          .map(item => {
            const p = parseTimestamp(item.Timestamp);
            const dateString = p ? formatDate(p) : null;
            return { ...item, parsedTimestamp: p, date: dateString };
          })
          .filter(item => item.parsedTimestamp !== null)
          .sort((a, b) => b.parsedTimestamp - a.parsedTimestamp);

        setOpportunities(parsed);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  //refreshhandler
  const onRefresh = () => {
    setRefreshing(true);
    fetchOpportunities();
  };

  //datepicker
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !date) return;

    setSelectedDates(prevDates => {
      const exists = prevDates.some(d => d.toDateString() === date.toDateString());
      if (exists) {

        return prevDates.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prevDates, date];
      }
    });
  };

  //fliter
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

    if (selectedDates.length > 0) {
      const selectedStrings = selectedDates.map(formatDate);
      filtered = filtered.filter(op => selectedStrings.includes(op.date));
    }

    setFilteredData(filtered);
  }, [selectedBoardFilter, selectedCategoryFilter, selectedDates, opportunities]);

  const onSIPPress = () => {
    console.log('SIP button pressed!');
    //add navigations for SIP here
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#847ed6" />
        <Text style={{ marginTop: 10, color: '#847ed6' }}>Loading opportunities...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#847ed6']}
          tintColor="#847ed6"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Volunteering Opportunities</Text>
        <View style={styles.sipContainer}>
          <TouchableOpacity style={styles.sipButton} onPress={onSIPPress} activeOpacity={0.7}>
            <Text style={styles.sipButtonText}>SIP</Text>
          </TouchableOpacity>
          <Text style={styles.sipSubtitle}>Student-Initiated-Project</Text>
        </View>
      </View>

      <View style={styles.filterBox}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: '#e8f5e8' }]}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, { color: '#2d7d32' }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.sectionLabel}>Filter by Board / Group</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {boardFilters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, selectedBoardFilter === filter && styles.filterButtonSelected]}
                onPress={() => setSelectedBoardFilter(selectedBoardFilter === filter ? null : filter)}
              >
                <Text style={[styles.filterText, selectedBoardFilter === filter && styles.filterTextSelected]}>
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
                style={[styles.filterButton, selectedCategoryFilter === filter && styles.filterButtonSelected]}
                onPress={() => setSelectedCategoryFilter(selectedCategoryFilter === filter ? null : filter)}
              >
                <Text style={[styles.filterText, selectedCategoryFilter === filter && styles.filterTextSelected]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.datePickerBox}>
            <Text style={styles.sectionLabel}>Filter by Date</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={{ fontSize: 16, color: selectedDates.length > 0 ? '#333' : '#aaa' }}>
                {selectedDates.length > 0
                  ? selectedDates.map(formatDate).join(', ')
                  : 'Select date(s)'}
              </Text>
            </TouchableOpacity>

            {selectedDates.length > 0 && (
              <TouchableOpacity onPress={() => setSelectedDates([])} style={styles.clearDateButton}>
                <Text style={styles.clearDateText}>Clear Dates</Text>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
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
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResults}>No opportunities found.</Text>
            <Text style={styles.noResultsSubtext}>Pull down to refresh or try different filters</Text>
          </View>
        ) : (
          filteredData.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => {
                const { parsedTimestamp, ...serializableItem } = item;
                navigation.navigate('Details', { opportunity: JSON.stringify(serializableItem) });
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.name}>{item["Name of your volunteering opportunity"]}</Text>
              <Text style={styles.info}>Date: {item.date || 'N/A'}</Text>
              <Text style={styles.info}>Time: {item.time || 'N/A'}</Text>
              <Text style={styles.info}>Category: {item.Category || 'N/A'}</Text>
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
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3a3a3a',
    flex: 1,
    paddingVertical: 10,

  },
  sipContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sipButton: {
    backgroundColor: '#3b82f6', // nice blue
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  sipButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  sipSubtitle: {
    color: '#777',
    fontSize: 10,
    marginTop: 2,
  },
  filterBox: {
    paddingHorizontal: 20,
    marginBottom: 0,
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 18,
    backgroundColor: '#e0e0f7',
    borderRadius: 25,
    marginRight: 12,
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
  filters: {
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  horizontalScroll: {
    marginBottom: 15,
  },
  datePickerBox: {
    marginTop: 10,
  },
  datePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
  },
  clearDateButton: {
    marginTop: 8,
  },
  clearDateText: {
    color: '#847ed6',
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
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  noResults: {
    fontStyle: 'italic',
    color: '#999',
    fontSize: 18,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});
