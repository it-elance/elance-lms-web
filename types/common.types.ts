// A completed batch stays listed, but its videos and materials are locked
export type BatchStatus = 'active' | 'completed';

export interface Pagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
