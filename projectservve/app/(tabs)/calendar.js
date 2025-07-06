import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonthMondayStart(month, year) {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatMonthYear(month, year) {
  const date = new Date(year, month);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarWithEventList() {
  const todayDate = new Date();
  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.getMonth();
  const todayYear = todayDate.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [currentYear, setCurrentYear] = useState(todayYear);

  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); 

  const [events, setEvents] = useState({});

  const totalDays = daysInMonth(currentMonth, currentYear);
  const startWeekday = firstDayOfMonthMondayStart(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < startWeekday; i++) calendarDays.push(null);
  for (let day = 1; day <= totalDays; day++) calendarDays.push(day);

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    resetModal();
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    resetModal();
  };

  const resetModal = () => {
    setSelectedDay(null);
    setModalVisible(false);
    setShowAddForm(false);
  };

  const openModalForDay = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setShowAddForm(false);
    setModalVisible(true);
  };

  // Form state
  const [eventText, setEventText] = useState('');
  const [eventTime, setEventTime] = useState('');

  const saveEvent = () => {
    if (!eventText.trim() || !eventTime.trim()) {
      alert('Please enter both event description and time.');
      return;
    }
    const key = formatDateKey(currentYear, currentMonth, selectedDay);
    const dayEvents = events[key] || [];
    setEvents({
      ...events,
      [key]: [...dayEvents, { text: eventText.trim(), time: eventTime.trim() }],
    });
    setEventText('');
    setEventTime('');
    setShowAddForm(false);
  };

  const keyForDay = (day) => formatDateKey(currentYear, currentMonth, day);

  const selectedDayKey = selectedDay ? keyForDay(selectedDay) : null;
  const selectedDayEvents = selectedDayKey && events[selectedDayKey] ? events[selectedDayKey] : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goPrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{formatMonthYear(currentMonth, currentYear)}</Text>
        <TouchableOpacity onPress={goNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/*weekdays*/}
      <View style={styles.weekdaysContainer}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      {/*calendar*/}
      <ScrollView contentContainerStyle={styles.calendarContainer}>
        {calendarDays.map((day, idx) => {
          const isToday =
            day === todayDay && currentMonth === todayMonth && currentYear === todayYear;
          const dayKey = day ? keyForDay(day) : null;
          const dayEvents = dayKey && events[dayKey] ? events[dayKey] : [];

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.dayBox, isToday && styles.todayBox]}
              onPress={() => openModalForDay(day)}
              activeOpacity={day ? 0.6 : 1}
              disabled={!day}
            >
              <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
                {day || ''}
              </Text>
              {dayEvents.length > 0 && (
                <View style={styles.eventIndicator}>
                  <Text style={styles.eventIndicatorText}>{dayEvents.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            {showAddForm ? (
              <>
                <Text style={styles.modalTitle}>
                  Add Event for {selectedDay} {formatMonthYear(currentMonth, currentYear)}
                </Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Event description"
                  value={eventText}
                  onChangeText={setEventText}
                  autoFocus={true}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Time (e.g., 10:00 AM)"
                  value={eventTime}
                  onChangeText={setEventTime}
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={saveEvent}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  Events for {selectedDay} {formatMonthYear(currentMonth, currentYear)}
                </Text>

                <ScrollView style={{ maxHeight: 220, marginBottom: 15 }}>
                  {selectedDayEvents.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                      No events yet.
                    </Text>
                  ) : (
                    selectedDayEvents.map((ev, i) => (
                      <View key={i} style={styles.eventItem}>
                        <Text style={styles.eventTime}>{ev.time}</Text>
                        <Text style={styles.eventText}>{ev.text}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                    onPress={resetModal}
                  >
                    <Text>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setShowAddForm(true);
                      setEventText('');
                      setEventTime('');
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '600' }}>Add New Event</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  headerContainer: {
    marginTop: 50,
    marginHorizontal: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  navButtonText: { fontSize: 28, fontWeight: '600', color: '#1C1C1E', lineHeight: 30 },
  headerText: { fontSize: 28, fontWeight: '300', color: '#1C1C1E' },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
    width: '13.6%',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 24,
    paddingBottom: 40,
  },
  dayBox: {
    width: '13.6%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  dayNumber: { fontSize: 16, fontWeight: '400', color: '#1C1C1E' },
  todayBox: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  todayNumber: { color: '#FFFFFF', fontWeight: '600' },

  eventIndicator: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 16,
    alignItems: 'center',
  },
  eventIndicatorText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#1C1C1E',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  eventItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventTime: {
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  eventText: {
    color: '#1C1C1E',
  },
});
