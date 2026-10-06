export interface Paper {
  paper_id: string;
  code: string;
  name: string;
  total_chapters?: number;
  is_active?: boolean;
}

export interface PaperResponse {
  status: string;
  data: {
    papers: Paper[];
  };
}

export interface Chapter {
  chapter_id: string;
  title: string;
  chapter_number: number;
  paper_id: string;
  paper_code: string;
  is_selected?: boolean;
}

export interface ChapterResponse {
  status: string;
  data: {
    chapters: Chapter[];
  };
}
