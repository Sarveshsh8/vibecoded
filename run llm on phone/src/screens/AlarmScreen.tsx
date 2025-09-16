import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Switch,
  useTheme,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

interface Alarm {
  id: string;
  time: string;
  label: string;
  isEnabled: boolean;
  isRecurring: boolean;
  days: string[];
  sound: string;
  vibration: boolean;
  smartWake: boolean;
}

export default function AlarmScreen() {
  const theme = useTheme();
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '07:00',
      label: 'Morning Alarm',
      isEnabled: true,
      isRecurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      sound: 'gentle',
      vibration: true,
      smartWake: true,
    },
    {
      id: '2',
      time: '08:30',
      label: 'Weekend Wake-up',
      isEnabled: true,
      isRecurring: true,
      days: ['Sat', 'Sun'],
      sound: 'nature',
      vibration: false,
      smartWake: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    time: '07:00',
    label: '',
    isEnabled: true,
    isRecurring: false,
    days: [],
    sound: 'gentle',
    vibration: true,
    smartWake: false,
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const soundOptions = ['gentle', 'nature', 'classic', 'modern'];

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to use alarm features.');
    }
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
    ));
  };

  const handleDeleteAlarm = (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setAlarms(prev => prev.filter(alarm => alarm.id !== id))
        },
      ]
    );
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setNewAlarm(alarm);
    setModalVisible(true);
  };

  const handleAddAlarm = () => {
    if (!newAlarm.label?.trim()) {
      Alert.alert('Error', 'Please enter a label for the alarm');
      return;
    }

    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarm.time || '07:00',
      label: newAlarm.label,
      isEnabled: newAlarm.isEnabled || true,
      isRecurring: newAlarm.isRecurring || false,
      days: newAlarm.days || [],
      sound: newAlarm.sound || 'gentle',
      vibration: newAlarm.vibration || true,
      smartWake: newAlarm.smartWake || false,
    };

    setAlarms(prev => [...prev, alarm]);
    setModalVisible(false);
    resetNewAlarm();
  };

  const handleUpdateAlarm = () => {
    if (!editingAlarm || !newAlarm.label?.trim()) {
      Alert.alert('Error', 'Please enter a label for the alarm');
      return;
    }

    setAlarms(prev => prev.map(alarm => 
      alarm.id === editingAlarm.id 
        ? {
            ...alarm,
            time: newAlarm.time || alarm.time,
            label: newAlarm.label || alarm.label,
            isEnabled: newAlarm.isEnabled || alarm.isEnabled,
            isRecurring: newAlarm.isRecurring || alarm.isRecurring,
            days: newAlarm.days || alarm.days,
            sound: newAlarm.sound || alarm.sound,
            vibration: newAlarm.vibration || alarm.vibration,
            smartWake: newAlarm.smartWake || alarm.smartWake,
          }
        : alarm
    ));
    setModalVisible(false);
    setEditingAlarm(null);
    resetNewAlarm();
  };

  const resetNewAlarm = () => {
    setNewAlarm({
      time: '07:00',
      label: '',
      isEnabled: true,
      isRecurring: false,
      days: [],
      sound: 'gentle',
      vibration: true,
      smartWake: false,
    });
  };

  const toggleDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days?.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };

  const getNextAlarmTime = (): Alarm | null => {
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextAlarm: Alarm | null = null;
    let minTimeDiff = Infinity;

    alarms.forEach(alarm => {
      if (!alarm.isEnabled) return;

      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmTime = hours * 60 + minutes;

      if (alarm.isRecurring && alarm.days.includes(currentDay)) {
        const timeDiff = alarmTime > currentTime ? alarmTime - currentTime : (24 * 60) - (currentTime - alarmTime);
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          nextAlarm = alarm;
        }
      } else if (!alarm.isRecurring) {
        const alarmDate = new Date();
        alarmDate.setHours(hours, minutes, 0, 0);
        if (alarmDate > now) {
          const timeDiff = alarmDate.getTime() - now.getTime();
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            nextAlarm = alarm;
          }
        }
      }
    });

    return nextAlarm;
  };

  const nextAlarm = getNextAlarmTime();

  const renderAlarmCard = (alarm: Alarm) => (
    <Card 
      key={alarm.id}
      style={[
        styles.alarmCard,
        { 
          backgroundColor: alarm.isEnabled ? theme.colors.surface : theme.colors.surfaceVariant,
          opacity: alarm.isEnabled ? 1 : 0.6,
        }
      ]}
    >
      <Card.Content>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Text variant="headlineMedium" style={styles.alarmTime}>
              {alarm.time}
            </Text>
            <Text variant="titleMedium" style={styles.alarmLabel}>
              {alarm.label}
            </Text>
            {alarm.isRecurring && (
              <Text variant="bodySmall" style={styles.alarmDays}>
                {alarm.days.join(', ')}
              </Text>
            )}
          </View>
          <Switch
            value={alarm.isEnabled}
            onValueChange={() => handleToggleAlarm(alarm.id)}
          />
        </View>
        
        <View style={styles.alarmFeatures}>
          <View style={styles.featureChip}>
            <Ionicons 
              name="musical-notes" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text variant="bodySmall" style={styles.featureText}>
              {alarm.sound}
            </Text>
          </View>
          {alarm.vibration && (
            <View style={styles.featureChip}>
              <Ionicons 
                name="phone-portrait" 
                size={16} 
                color={theme.colors.primary} 
              />
              <Text variant="bodySmall" style={styles.featureText}>
                Vibration
              </Text>
            </View>
          )}
          {alarm.smartWake && (
            <View style={styles.featureChip}>
              <Ionicons 
                name="bulb" 
                size={16} 
                color={theme.colors.primary} 
              />
              <Text variant="bodySmall" style={styles.featureText}>
                Smart Wake
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.alarmActions}>
          <Button
            mode="text"
            onPress={() => handleEditAlarm(alarm)}
            icon="pencil"
          >
            Edit
          </Button>
          <Button
            mode="text"
            onPress={() => handleDeleteAlarm(alarm.id)}
            icon="delete"
            textColor={theme.colors.error}
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Smart Alarms
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Wake up refreshed with intelligent alarms
          </Text>
        </View>

        {nextAlarm && (
          <Card style={[styles.nextAlarmCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.nextAlarmTitle}>
                Next Alarm
              </Text>
              <Text variant="headlineMedium" style={styles.nextAlarmTime}>
                {nextAlarm.time}
              </Text>
              <Text variant="bodyMedium" style={styles.nextAlarmLabel}>
                {nextAlarm.label}
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.alarmsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Your Alarms
          </Text>
          {alarms.map(renderAlarmCard)}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            setEditingAlarm(null);
            resetNewAlarm();
            setModalVisible(true);
          }}
          style={styles.addButton}
          icon="plus"
        >
          Add New Alarm
        </Button>
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingAlarm(null);
            resetNewAlarm();
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {editingAlarm ? 'Edit Alarm' : 'Add New Alarm'}
          </Text>
          
          <TextInput
            label="Alarm Label"
            value={newAlarm.label || ''}
            onChangeText={(text) => setNewAlarm(prev => ({ ...prev, label: text }))}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Time (HH:MM)"
            value={newAlarm.time || '07:00'}
            onChangeText={(text) => setNewAlarm(prev => ({ ...prev, time: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Recurring Alarm</Text>
            <Switch
              value={newAlarm.isRecurring || false}
              onValueChange={(value) => setNewAlarm(prev => ({ ...prev, isRecurring: value }))}
            />
          </View>
          
          {newAlarm.isRecurring && (
            <View style={styles.daysContainer}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Repeat Days</Text>
              <View style={styles.daysGrid}>
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    mode={newAlarm.days?.includes(day) ? 'contained' : 'outlined'}
                    onPress={() => toggleDay(day)}
                    style={styles.dayButton}
                    compact
                  >
                    {day}
                  </Button>
                ))}
              </View>
            </View>
          )}
          
          <Text variant="titleMedium" style={styles.sectionTitle}>Sound</Text>
          <SegmentedButtons
            value={newAlarm.sound || 'gentle'}
            onValueChange={(value) => setNewAlarm(prev => ({ ...prev, sound: value }))}
            buttons={soundOptions.map(sound => ({ value: sound, label: sound }))}
            style={styles.segmentedButtons}
          />
          
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Vibration</Text>
            <Switch
              value={newAlarm.vibration || false}
              onValueChange={(value) => setNewAlarm(prev => ({ ...prev, vibration: value }))}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Smart Wake (gradual volume)</Text>
            <Switch
              value={newAlarm.smartWake || false}
              onValueChange={(value) => setNewAlarm(prev => ({ ...prev, smartWake: value }))}
            />
          </View>
          
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setEditingAlarm(null);
                resetNewAlarm();
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={editingAlarm ? handleUpdateAlarm : handleAddAlarm}
            >
              {editingAlarm ? 'Update' : 'Add'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  nextAlarmCard: {
    marginBottom: 20,
    elevation: 2,
  },
  nextAlarmTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextAlarmTime: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextAlarmLabel: {
    opacity: 0.8,
  },
  alarmsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alarmCard: {
    marginBottom: 12,
    elevation: 2,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alarmLabel: {
    marginBottom: 4,
  },
  alarmDays: {
    opacity: 0.7,
  },
  alarmFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
  },
  alarmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  addButton: {
    marginTop: 20,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    minWidth: 50,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
});
