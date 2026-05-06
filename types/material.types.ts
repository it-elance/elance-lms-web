export interface Material {
  material_id: string;
  title: string;
  is_favourite: boolean;
  type: 'lecture' | 'chapter';
  file_type: string;
  file_size: string;
  file_url: string;
}

export interface MaterialsByLectureResponse {
  status: string;
  data: Material[];
}
