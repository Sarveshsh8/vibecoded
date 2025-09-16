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
  Surface,
  Divider,
  Avatar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function AlarmScreenExpoGo() {
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
    
    // Show a simple alert for now (in a real app, this would set an actual alarm)
    Alert.alert(
      'Alarm Set!',
      `Alarm "${alarm.label}" set for ${alarm.time}${alarm.isRecurring ? ` (${alarm.days.join(', ')})` : ''}`,
      [{ text: 'OK' }]
    );
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
    <LinearGradient
      key={alarm.id}
      colors={alarm.isEnabled ? ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'] : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.alarmCard,
        { opacity: alarm.isEnabled ? 1 : 0.6 }
      ]}
    >
      <View style={styles.alarmContent}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Text variant="headlineLarge" style={styles.alarmTime}>
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
            trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
            thumbColor={alarm.isEnabled ? theme.colors.onPrimary : theme.colors.surface}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.alarmFeatures}>
          <View style={[styles.featureChip, { backgroundColor: theme.colors.primaryContainer }]}>
            <Ionicons 
              name="musical-notes" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.primary }]}>
              {alarm.sound}
            </Text>
          </View>
          {alarm.vibration && (
            <View style={[styles.featureChip, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons 
                name="phone-portrait" 
                size={16} 
                color={theme.colors.secondary} 
              />
              <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.secondary }]}>
                Vibration
              </Text>
            </View>
          )}
          {alarm.smartWake && (
            <View style={[styles.featureChip, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons 
                name="bulb" 
                size={16} 
                color={theme.colors.tertiary} 
              />
              <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.tertiary }]}>
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
            textColor={theme.colors.primary}
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
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Beautiful Gradient Header */}
      <LinearGradient
        colors={theme.colors.gradient3}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Avatar.Icon
            size={44}
            icon="alarm"
            style={[styles.headerAvatar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Smart Alarms
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Wake up refreshed
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

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
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  nextAlarmCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 16,
  },
  nextAlarmTitle: {
    fontWeight: '600',
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
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 18,
  },
  alarmCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  alarmContent: {
    padding: 16,
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
    fontWeight: '500',
  },
  alarmDays: {
    opacity: 0.7,
  },
  divider: {
    marginVertical: 12,
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
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alarmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 12,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: '600',
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
