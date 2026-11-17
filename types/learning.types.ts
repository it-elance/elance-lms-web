import type { BatchStatus, Pagination } from './common.types';

export interface Subject {
  id: string;
  title: string;
  code: string;
  total_chapters: number;
  completed_chapters: number;
  progress_percentage: number;
  icon_url: string;
  batch_status: BatchStatus;
  // A student may be in two batches of one paper, so each card is one batch
  batch_id?: string | null;
  batch_name?: string;
}

export interface MyLearningResponse {
  status: string;
  data: {
    subjects: Subject[];
  };
  pagination: Pagination;
}
