import type { Pagination } from './common.types';

export interface Subject {
  id: string;
  title: string;
  code: string;
  total_chapters: number;
  completed_chapters: number;
  progress_percentage: number;
  icon_url: string;
}

export interface MyLearningResponse {
  status: string;
  data: {
    subjects: Subject[];
  };
  pagination: Pagination;
}
