import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Switch,
  Button,
  List,
  useTheme,
  Divider,
  Avatar,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    smartWake: true,
    darkMode: false,
    voiceResponses: true,
    autoSchedule: false,
    reminderSounds: true,
    vibration: true,
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Your Name',
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    workStart: '09:00',
    workEnd: '17:00',
  });

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleEditProfile = () => {
    setTempProfile(userProfile);
    setEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setEditProfileModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export your schedule, alarms, and preferences. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => Alert.alert('Export', 'Data export feature coming soon!')
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your schedules, alarms, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => Alert.alert('Cleared', 'All data has been cleared.')
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About AI Assistant',
      'Version 1.0.0\n\nYour personal AI assistant for managing daily schedules, smart alarms, and staying organized.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Section */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Icon
                size={64}
                icon="account"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <View style={styles.profileInfo}>
                <Text variant="headlineSmall" style={styles.profileName}>
                  {userProfile.name}
                </Text>
                <Text variant="bodyMedium" style={styles.profileSubtitle}>
                  AI Assistant User
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                icon="pencil"
                compact
              >
                Edit
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Preferences Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Preferences
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications for alarms and reminders"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => handleSettingChange('notifications', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Smart Wake"
              description="Gradually increase alarm volume"
              left={(props) => <List.Icon {...props} icon="weather-sunny" />}
              right={() => (
                <Switch
                  value={settings.smartWake}
                  onValueChange={(value) => handleSettingChange('smartWake', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Voice Responses"
              description="AI responds with voice messages"
              left={(props) => <List.Icon {...props} icon="microphone" />}
              right={() => (
                <Switch
                  value={settings.voiceResponses}
                  onValueChange={(value) => handleSettingChange('voiceResponses', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Auto Schedule"
              description="Automatically suggest schedule items"
              left={(props) => <List.Icon {...props} icon="calendar-auto" />}
              right={() => (
                <Switch
                  value={settings.autoSchedule}
                  onValueChange={(value) => handleSettingChange('autoSchedule', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Reminder Sounds"
              description="Play sounds for reminders"
              left={(props) => <List.Icon {...props} icon="volume-high" />}
              right={() => (
                <Switch
                  value={settings.reminderSounds}
                  onValueChange={(value) => handleSettingChange('reminderSounds', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Vibration"
              description="Vibrate for notifications"
              left={(props) => <List.Icon {...props} icon="phone-portrait" />}
              right={() => (
                <Switch
                  value={settings.vibration}
                  onValueChange={(value) => handleSettingChange('vibration', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Data Management Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Data Management
            </Text>
            
            <List.Item
              title="Export Data"
              description="Export your schedules and settings"
              left={(props) => <List.Icon {...props} icon="download" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleExportData}
            />
            
            <Divider />
            
            <List.Item
              title="Clear All Data"
              description="Delete all schedules, alarms, and settings"
              left={(props) => <List.Icon {...props} icon="delete" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleClearData}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card.Content>
        </Card>

        {/* Support Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Support
            </Text>
            
            <List.Item
              title="Help & FAQ"
              description="Get help and find answers"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Help', 'Help section coming soon!')}
            />
            
            <Divider />
            
            <List.Item
              title="Contact Support"
              description="Get in touch with our team"
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Contact', 'Contact support coming soon!')}
            />
            
            <Divider />
            
            <List.Item
              title="About"
              description="App version and information"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAbout}
            />
          </Card.Content>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text variant="bodySmall" style={styles.appVersion}>
            AI Assistant v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.appDescription}>
            Your personal AI companion for daily productivity
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={editProfileModal}
          onDismiss={() => setEditProfileModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Edit Profile
          </Text>
          
          <TextInput
            label="Name"
            value={tempProfile.name}
            onChangeText={(text) => setTempProfile(prev => ({ ...prev, name: text }))}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Wake Up Time (HH:MM)"
            value={tempProfile.wakeUpTime}
            onChangeText={(text) => setTempProfile(prev => ({ ...prev, wakeUpTime: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          
          <TextInput
            label="Sleep Time (HH:MM)"
            value={tempProfile.sleepTime}
            onChangeText={(text) => setTempProfile(prev => ({ ...prev, sleepTime: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          
          <TextInput
            label="Work Start Time (HH:MM)"
            value={tempProfile.workStart}
            onChangeText={(text) => setTempProfile(prev => ({ ...prev, workStart: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          
          <TextInput
            label="Work End Time (HH:MM)"
            value={tempProfile.workEnd}
            onChangeText={(text) => setTempProfile(prev => ({ ...prev, workEnd: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setEditProfileModal(false)}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
            >
              Save
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
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
  },
  profileSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  appVersion: {
    fontWeight: 'bold',
    opacity: 0.7,
  },
  appDescription: {
    opacity: 0.5,
    marginTop: 4,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
});
