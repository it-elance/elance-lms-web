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
