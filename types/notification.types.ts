import type { Pagination } from '@/types/common.types';

export interface NotificationItem {
  _id: string;
  student: string;
  title: string;
  content: string;
  // the batch, chapter, announcement or student it is about (see event)
  relatedId: string;
  // the tab: academics or general
  type: string;
  // batch_assigned, new_lectures, new_materials, announcement, batch_ending or
  // student_status
  event?: string;
  // true while unread
  status: boolean;
  createdAt?: string;
}

export interface NotificationResponse {
  status: string;
  message: string;
  notification: NotificationItem[];
  pagination: Pagination;
}

export interface ReadNotificationPayload {
  notification_id: string;
}
