export interface AnalyticsCourse {
  course_id: string;
  title: string;
}

export interface AnalyticsOverallProgress {
  progress_percentage: number;
  completed_chapters: number;
  total_chapters: number;
  estimated_time_left_hours: number;
  expected_completion_date: string;
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

export interface AnalyticsData {
  course: AnalyticsCourse;
  overall_progress: AnalyticsOverallProgress;
  watch_time: AnalyticsWatchTime;
  weekly_activity?: AnalyticsWeeklyActivity[];
  completion_summary: AnalyticsCompletionSummary;
  highlights: AnalyticsHighlights;
}

export interface AnalyticsApiResponse {
  status: string;
  data: AnalyticsData;
}
