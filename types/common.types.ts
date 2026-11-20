// A completed batch stays listed, but its videos and materials are locked
// A batch as this student sees it: completed, not started (its start date is still to come) and
// inactive (an admin made the student inactive in it) are locked
export type BatchStatus = 'active' | 'completed' | 'not_started' | 'inactive';

export interface Pagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
