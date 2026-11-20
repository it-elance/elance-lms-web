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
  batch_start_date?: string | null;
  // The day the student's access runs through (the batch's end date, or their extension)
  batch_end_date?: string | null;
}

export interface MyLearningResponse {
  status: string;
  data: {
    subjects: Subject[];
  };
  pagination: Pagination;
}
