export interface AnalyticsCourse {
  course_id: string;
  title: string;
}

export interface AnalyticsOverallProgress {
  progress_percentage: number;
  completed_chapters: number;
  total_chapters: number;
  estimated_time_left_hours: number;
  estimated_time_left_label?: string;
  expected_completion_date: string;
  // share of classmates who watched less this week; null when there's nothing to compare
  pace_percentile?: number | null;
}

export interface AnalyticsWatchTime {
  this_week_seconds: number;
  this_week_label: string;
  average_per_day_seconds: number;
  average_per_day_label: string;
}

export interface AnalyticsWeeklyActivity {
  day: string;
  watch_seconds: number;
}

export interface AnalyticsCompletionSummary {
  completed_videos: number;
  total_videos: number;
}

export interface AnalyticsHighlights {
  watched_hours_this_week: number;
  completed_modules_this_month: number;
}

export interface RecentlyWatchedVideo {
  paper_id: string;
  chapter_id: string;
  // entity_id for the favourite toggle; null if the lecture is gone
  lecture_id: string | null;
  topic_id: string;
  title: string;
  thumbnail_url: string;
  duration_seconds: number;
  // Seconds into the video where the student stopped
  watched_seconds: number;
  // stays true once completed, even while the video is rewatched
  is_completed?: boolean;
  is_favourite: boolean;
}

export interface AnalyticsData {
  course: AnalyticsCourse;
  overall_progress: AnalyticsOverallProgress;
  watch_time: AnalyticsWatchTime;
  weekly_activity?: AnalyticsWeeklyActivity[];
  recently_watched_videos?: RecentlyWatchedVideo[];
  completion_summary: AnalyticsCompletionSummary;
  highlights: AnalyticsHighlights;
}

export interface AnalyticsApiResponse {
  status: string;
  data: AnalyticsData;
}
