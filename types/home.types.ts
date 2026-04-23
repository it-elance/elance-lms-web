export interface UserProgram {
  program_id: string;
  code: string;
  name: string;
}

export interface HomeUser {
  user_id: string;
  full_name: string;
  profile_image_url: string;
  student_id: string;
  programs: UserProgram[];
  email: string;
  mobile_number: string;
  account_status: string;
  created_at: string;
}

export interface SelectedProgram {
  program_id: string;
  code: string;
  name: string;
}

export interface AvailableProgram {
  program_id: string;
  code: string;
  name: string;
  is_selected: boolean;
}

export interface ContinueWatching {
  lecture_id: string;
  title: string;
  subject: string;
  paper_code: string;
  thumbnail_url: string;
  last_watched_label: string;
  progress_percent?: number;
  remaining_time_label: number | null;
}

export interface MyLearningItem {
  subject_id: string;
  title: string;
  paper_code: string;
  total_chapters: number;
  completed_chapters: number;
  progress_percentage: number;
  image_url: string;
}

export interface Announcement {
  announcement_id: string;
  category: string;
  title: string;
  description: string;
  image_url: string;
  published_at: string;
}

export interface HomeData {
  user: HomeUser;
  selected_program: SelectedProgram;
  available_programs: AvailableProgram[];
  continue_watching: ContinueWatching;
  my_learning: MyLearningItem[];
  announcements: Announcement[];
}

export interface HomeApiResponse {
  status: string;
  data: HomeData;
}
