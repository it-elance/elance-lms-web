export interface Subject {
  id: string;
  title: string;
  code: string;
  total_chapters: number;
  completed_chapters: number;
  progress_percentage: number;
  icon_url: string;
}

export interface MyLearningPagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface MyLearningResponse {
  status: string;
  data: {
    subjects: Subject[];
  };
  pagination: MyLearningPagination;
}
