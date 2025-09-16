import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  FAB,
  Chip,
  useTheme,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
  Surface,
  Avatar,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleItem } from '../types/chat';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScheduleScreen() {
  const theme = useTheme();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Morning Workout',
      description: '30 minutes of cardio and strength training',
      startTime: new Date(2024, 0, 1, 7, 0),
      endTime: new Date(2024, 0, 1, 7, 30),
      isRecurring: true,
      category: 'health',
      priority: 'high',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Weekly standup with the development team',
      startTime: new Date(2024, 0, 1, 10, 0),
      endTime: new Date(2024, 0, 1, 11, 0),
      isRecurring: true,
      category: 'work',
      priority: 'high',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Lunch Break',
      description: 'Time to refuel and relax',
      startTime: new Date(2024, 0, 1, 12, 0),
      endTime: new Date(2024, 0, 1, 13, 0),
      isRecurring: true,
      category: 'personal',
      priority: 'medium',
      isCompleted: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'personal' as ScheduleItem['category'],
    priority: 'medium' as ScheduleItem['priority'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
  });

  const categoryColors = {
    work: '#3b82f6',
    personal: '#10b981',
    health: '#f59e0b',
    leisure: '#8b5cf6',
    other: '#6b7280',
  };

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the schedule item');
      return;
    }

    const item: ScheduleItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      startTime: newItem.startTime,
      endTime: newItem.endTime,
      isRecurring: false,
      category: newItem.category,
      priority: newItem.priority,
      isCompleted: false,
    };

    setScheduleItems(prev => [...prev, item]);
    setModalVisible(false);
    resetNewItem();
  };

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      description: item.description || '',
      category: item.category,
      priority: item.priority,
      startTime: item.startTime,
      endTime: item.endTime,
    });
    setModalVisible(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the schedule item');
      return;
    }

    setScheduleItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            title: newItem.title,
            description: newItem.description,
            category: newItem.category,
            priority: newItem.priority,
            startTime: newItem.startTime,
            endTime: newItem.endTime,
          }
        : item
    ));
    setModalVisible(false);
    setEditingItem(null);
    resetNewItem();
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this schedule item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setScheduleItems(prev => prev.filter(item => item.id !== id))
        },
      ]
    );
  };

  const handleToggleComplete = (id: string) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const resetNewItem = () => {
    setNewItem({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <LinearGradient
      colors={item.isCompleted ? ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)'] : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.scheduleCard,
        { opacity: item.isCompleted ? 0.7 : 1 }
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.itemTitle,
                item.isCompleted && styles.completedText
              ]}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.itemDescription,
                  item.isCompleted && styles.completedText
                ]}
              >
                {item.description}
              </Text>
            )}
          </View>
          <Button
            mode="text"
            onPress={() => handleToggleComplete(item.id)}
            icon={item.isCompleted ? 'check-circle' : 'circle-outline'}
            textColor={item.isCompleted ? theme.colors.secondary : theme.colors.primary}
            compact
          >
            {item.isCompleted ? 'Done' : 'Mark Done'}
          </Button>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.itemMeta}>
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={16} color={theme.colors.primary} />
            <Text variant="bodySmall" style={styles.timeText}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
          <View style={styles.chipsContainer}>
            <Chip 
              mode="outlined" 
              compact
              style={[styles.categoryChip, { borderColor: categoryColors[item.category] }]}
              textStyle={{ color: categoryColors[item.category] }}
            >
              {item.category}
            </Chip>
            <Chip 
              mode="outlined" 
              compact
              style={[styles.priorityChip, { borderColor: priorityColors[item.priority] }]}
              textStyle={{ color: priorityColors[item.priority] }}
            >
              {item.priority}
            </Chip>
          </View>
        </View>
        
        <View style={styles.itemFooter}>
          <Button
            mode="text"
            onPress={() => handleEditItem(item)}
            icon="pencil"
            textColor={theme.colors.primary}
          >
            Edit
          </Button>
          <Button
            mode="text"
            onPress={() => handleDeleteItem(item.id)}
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
        colors={theme.colors.gradient2}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Avatar.Icon
            size={44}
            icon="calendar"
            style={[styles.headerAvatar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Today's Schedule
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {scheduleItems.filter(item => !item.isCompleted).length} items remaining
            </Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={scheduleItems}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        style={styles.scheduleList}
        contentContainerStyle={styles.scheduleContent}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setEditingItem(null);
          resetNewItem();
          setModalVisible(true);
        }}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingItem(null);
            resetNewItem();
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}
          </Text>
          
          <TextInput
            label="Title"
            value={newItem.title}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, title: text }))}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Description (optional)"
            value={newItem.description}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
            style={styles.input}
            mode="outlined"
            multiline
          />
          
          <Text variant="titleMedium" style={styles.sectionTitle}>Category</Text>
          <SegmentedButtons
            value={newItem.category}
            onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value as ScheduleItem['category'] }))}
            buttons={[
              { value: 'work', label: 'Work' },
              { value: 'personal', label: 'Personal' },
              { value: 'health', label: 'Health' },
              { value: 'leisure', label: 'Leisure' },
              { value: 'other', label: 'Other' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text variant="titleMedium" style={styles.sectionTitle}>Priority</Text>
          <SegmentedButtons
            value={newItem.priority}
            onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as ScheduleItem['priority'] }))}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setEditingItem(null);
                resetNewItem();
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={editingItem ? handleUpdateItem : handleAddItem}
            >
              {editingItem ? 'Update' : 'Add'}
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
  scheduleList: {
    flex: 1,
  },
  scheduleContent: {
    padding: 16,
  },
  scheduleCard: {
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
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  itemDescription: {
    opacity: 0.8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  itemMeta: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  timeText: {
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    height: 28,
  },
  priorityChip: {
    height: 28,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '600',
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
