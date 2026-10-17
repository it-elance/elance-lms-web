import { useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import {
  getNotificationsApi,
  readNotificationApi,
  readAllNotificationsApi,
} from '@/services/api.service';
import type {
  NotificationItem,
  NotificationResponse,
  ReadNotificationPayload,
} from '@/types/notification.types';

export const NOTIFICATIONS_PAGE_SIZE = 20;

const QUERY_KEY = ['notifications'];

// The student's notifications a page at a time, newest first; fetchNextPage
// loads the next one onto the end
export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getNotificationsApi(pageParam, NOTIFICATIONS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? lastPage.pagination.current_page + 1
        : undefined,
    staleTime: 1000 * 60 * 2,
  });

  // Pages are offsets, so a notification that arrives between two fetches
  // pushes the last one of a page into the next: each is listed once
  const notifications = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.notification)
      .filter((n) => {
        if (seen.has(n._id)) return false;
        seen.add(n._id);
        return true;
      });
  }, [data]);

  // Applies a change to every loaded notification
  const updateLoaded = (
    update: (notification: NotificationItem) => NotificationItem
  ) =>
    queryClient.setQueryData<InfiniteData<NotificationResponse>>(
      QUERY_KEY,
      (old) =>
        old && {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            notification: page.notification.map(update),
          })),
        }
    );

  const markAsReadMutation = useMutation({
    mutationFn: (payload: ReadNotificationPayload) =>
      readNotificationApi(payload),
    onSuccess: (_, variables) => {
      updateLoaded((n) =>
        n._id === variables.notification_id ? { ...n, status: false } : n
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: readAllNotificationsApi,
    onSuccess: () => {
      updateLoaded((n) => ({ ...n, status: false }));
    },
  });

  return {
    notifications,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch,
  };
};
