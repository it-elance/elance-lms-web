export interface Note {
  _id: string;
  video_id: string;
  time: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotePayload {
  video_id: string;
  time: string;
  content: string;
}

export interface UpdateNotePayload {
  _id: string;
  video_id: string;
  time: string;
  content: string;
}

export interface DeleteNotePayload {
  _id: string;
}
