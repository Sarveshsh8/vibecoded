import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  X,
  Star,
  Clock,
  Tag
} from 'lucide-react-native';
import { theme } from '../theme/theme';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  createdAt: Date;
}

const categories = ['Work', 'Personal', 'Health', 'Learning', 'Other'];
const priorities = [
  { key: 'high', label: 'High', color: theme.colors.priorityHigh },
  { key: 'medium', label: 'Medium', color: theme.colors.priorityMedium },
  { key: 'low', label: 'Low', color: theme.colors.priorityLow },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and submit the Q1 project proposal by Friday',
      priority: 'high',
      category: 'Work',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Morning workout',
      description: '30 minutes of cardio and strength training',
      priority: 'medium',
      category: 'Health',
      completed: true,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Read React Native docs',
      description: 'Study the latest React Native documentation',
      priority: 'low',
      category: 'Learning',
      completed: false,
      createdAt: new Date(),
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'Work',
  });

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => task.id !== id))
        },
      ]
    );
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
      createdAt: new Date(),
    };
    
    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'Work' });
    setModalVisible(false);
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.key === priority);
    return priorityObj?.color || theme.colors.priorityMedium;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Work: theme.colors.categoryWork,
      Personal: theme.colors.categoryPersonal,
      Health: theme.colors.categoryHealth,
      Learning: theme.colors.categoryLearning,
      Other: theme.colors.categoryOther,
    };
    return colors[category] || theme.colors.categoryOther;
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Animated.View style={styles.taskCard}>
      <LinearGradient
        colors={item.completed ? theme.gradients.surface : theme.gradients.glass}
        style={styles.taskGradient}
      >
        <View style={styles.taskContent}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => toggleTask(item.id)}
          >
            {item.completed ? (
              <CheckSquare size={24} color={theme.colors.success} />
            ) : (
              <Square size={24} color={theme.colors.onSurfaceVariant} />
            )}
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskTitle,
              item.completed && styles.completedText
            ]}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={[
                styles.taskDescription,
                item.completed && styles.completedText
              ]}>
                {item.description}
              </Text>
            ) : null}
            
            <View style={styles.taskMeta}>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) }
              ]}>
                <Text style={styles.priorityText}>
                  {priorities.find(p => p.key === item.priority)?.label}
                </Text>
              </View>
              
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.category) }
              ]}>
                <Tag size={12} color="#FFFFFF" />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteTask(item.id)}
          >
            <Trash2 size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {completedTasks} of {totalTasks} completed ({completionRate}%)
          </Text>
        </View>
        
        <LinearGradient
          colors={theme.gradients.success}
          style={styles.progressBar}
        >
          <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
        </LinearGradient>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.fabGradient}
        >
          <Plus size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.prioritySection}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityButtons}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.key}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority.key && styles.priorityButtonActive,
                      { borderColor: priority.color }
                    ]}
                    onPress={() => setNewTask({ ...newTask, priority: priority.key as any })}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === priority.key && { color: priority.color }
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryButtons}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newTask.category === category && styles.categoryButtonActive,
                      { borderColor: getCategoryColor(category) }
                    ]}
                    onPress={() => setNewTask({ ...newTask, category })}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      newTask.category === category && { color: getCategoryColor(category) }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addTask}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add Task</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerContent: {
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  progressBar: {
    height: 6,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  taskCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  checkbox: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  taskDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  categoryText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.onSurface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  priorityButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  categoryButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
