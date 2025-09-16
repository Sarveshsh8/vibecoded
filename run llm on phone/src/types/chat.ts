export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  action?: 'schedule' | 'alarm' | 'reminder' | 'none';
  data?: any;
}

export interface ChatContext {
  userPreferences: {
    wakeUpTime?: string;
    sleepTime?: string;
    workHours?: { start: string; end: string };
    interests?: string[];
  };
  recentMessages: Message[];
  currentSchedule: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  category: 'work' | 'personal' | 'health' | 'leisure' | 'other';
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
}
