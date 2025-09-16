import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CheckSquare, 
  Target, 
  Timer, 
  BarChart3,
  MessageCircle
} from 'lucide-react-native';

// Import screens
import TasksScreen from './src/screens/TasksScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import FocusScreen from './src/screens/FocusScreen';
import StatsScreen from './src/screens/StatsScreen';
import ChatScreen from './src/screens/ChatScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={StyleSheet.absoluteFillObject}
        />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let IconComponent;
              
              if (route.name === 'Tasks') {
                IconComponent = CheckSquare;
              } else if (route.name === 'Habits') {
                IconComponent = Target;
              } else if (route.name === 'Focus') {
                IconComponent = Timer;
              } else if (route.name === 'Chat') {
                IconComponent = MessageCircle;
              } else if (route.name === 'Stats') {
                IconComponent = BarChart3;
              }
              
              return <IconComponent size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
            tabBarStyle: {
              backgroundColor: 'rgba(99, 102, 241, 0.95)',
              borderTopWidth: 0,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerBackground: () => (
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          })}
        >
          <Tab.Screen 
            name="Tasks" 
            component={TasksScreen}
            options={{ title: 'Tasks' }}
          />
          <Tab.Screen 
            name="Habits" 
            component={HabitsScreen}
            options={{ title: 'Habits' }}
          />
          <Tab.Screen 
            name="Focus" 
            component={FocusScreen}
            options={{ title: 'Focus' }}
          />
          <Tab.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ title: 'Chat' }}
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen}
            options={{ title: 'Statistics' }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});