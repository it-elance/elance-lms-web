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
