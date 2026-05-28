export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

export interface NotificationMessage {
  id: string;
  title: string;
  content: string;
  level: NotificationLevel;
  read: boolean;
  createdAt: string;
}

export interface NotificationSnapshot {
  messages: NotificationMessage[];
  unreadCount: number;
  lastEvent: string;
}

export interface PublishInput {
  title: string;
  content: string;
  level: NotificationLevel;
}

export type NotificationListener = () => void;