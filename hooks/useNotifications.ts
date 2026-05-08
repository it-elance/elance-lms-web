import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationsApi,
  readNotificationApi,
  readAllNotificationsApi,
} from '@/services/api.service';
import type {
  NotificationItem,
  ReadNotificationPayload,
} from '@/types/notification.types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: getNotificationsApi,
    staleTime: 1000 * 60 * 2,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (payload: ReadNotificationPayload) =>
      readNotificationApi(payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<NotificationItem[]>(
        ['notifications'],
        (old = []) =>
          old.map((n) =>
            n._id === variables.notification_id ? { ...n, status: false } : n
          )
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: readAllNotificationsApi,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        ['notifications'],
        (old = []) => old.map((n) => ({ ...n, status: false }))
      );
    },
  });

  return {
    notifications,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch,
  };
};
