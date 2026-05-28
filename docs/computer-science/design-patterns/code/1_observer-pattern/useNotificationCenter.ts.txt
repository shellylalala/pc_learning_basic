import { useSyncExternalStore } from 'react';
import { notificationCenter } from './notificationCenter';

export function useNotificationCenter() {
  return useSyncExternalStore(
    notificationCenter.subscribe,
    notificationCenter.getSnapshot,
    notificationCenter.getSnapshot,
  );
}