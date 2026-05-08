export interface NotificationItem {
  _id: string;
  student: string;
  title: string;
  content: string;
  relatedId: string;
  type: string;
  status: boolean;
  createdAt?: string;
}

export interface NotificationResponse {
  status: string;
  message: string;
  notification: NotificationItem[];
}

export interface ReadNotificationPayload {
  notification_id: string;
}
