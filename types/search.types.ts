import type { Pagination } from '@/types/common.types';

export interface GlobalSearchTopic {
  topic_id: string;
  title: string;
  duration_seconds: number;
  duration_label: string;
  watch_duration_seconds: number;
  paper: {
    paper_id: string;
    code: string;
    title: string;
  };
  chapter: {
    chapter_id: string;
    chapter_no: number;
    title: string;
  };
}

export interface GlobalSearchResponse {
  status: string;
  data: {
    topics: GlobalSearchTopic[];
  };
  // sent when the request has page or page_size
  pagination?: Pagination;
}

// One page of search results
export interface GlobalSearchPage {
  topics: GlobalSearchTopic[];
  pagination: Pagination;
}
