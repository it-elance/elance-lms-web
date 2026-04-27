export interface LectureLesson {
  id: string;
  title: string;
  duration: number;
  isCompleted: boolean;
  type: string;
  video_id: string;
  thumbnail_url: string;
  is_favourite: boolean;
}

export interface LectureChapter {
  id: string;
  title: string;
  lessons: LectureLesson[];
  isOpen?: boolean;
}

export interface LectureByPaperResponse {
  status: string;
  data: LectureChapter[];
}

export interface LectureVideoData {
  lecture_id: string;
  access_token: string;
  topic_name: string;
  paper_code: string;
  chapter: string;
  is_favourite: boolean;
  video_id: string;
  thumbnail_url: string;
}

export interface LectureVideoResponse {
  status: string;
  data: {
    status: string;
    data: LectureVideoData;
  };
}

export interface PaperDetailsData {
  paper_info: {
    paper_title: string;
    paper_code: string;
    chapters_completed: number;
    total_chapters: number;
    last_updated: string;
  };
  statistics: {
    total_paper_duration: string;
    student_completion_rate: number;
    materials_available: number;
  };
  instructors: {
    name: string;
    qualification: string;
  }[];
  meta: {
    paper_id: string;
    paper_name: string;
    paper_code: string;
  };
}

export interface PaperDetailsResponse {
  status: string;
  data: {
    status: string;
    data: PaperDetailsData;
  };
}
