import type { Pagination } from './common.types';

export interface FavouritePayload {
  entity_type: 'lecture' | 'material';
  entity_id: string;
  is_favourite: boolean;
}

export interface FavouriteLecture {
  lecture_id: string;
  title: string;
  duration_seconds: number;
  duration_label: string;
  paper: {
    code: string;
    name: string;
  };
  chapter: {
    number: number;
    title: string;
  };
  thumbnail_url: string;
  is_favourite: boolean;
  created_at: string;
}

export interface FavouriteMaterial {
  material_id: string;
  title: string;
  file: {
    type: string;
    extension: string;
    size_kb: number;
    download_url: string;
    preview_url: string;
  };
  paper: {
    code: string;
    name: string;
  };
  chapter: {
    number: number;
    title: string;
  };
  is_favourite: boolean;
  created_at: string;
}

export interface FavouriteLecturesResponse {
  status: string;
  data: {
    lectures: FavouriteLecture[];
  };
  pagination: Pagination;
}

export interface FavouriteMaterialsResponse {
  status: string;
  data: {
    materials: FavouriteMaterial[];
  };
  pagination: Pagination;
}
