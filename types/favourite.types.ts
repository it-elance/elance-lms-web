export interface FavouritePayload {
  entity_type: 'lecture' | 'material';
  entity_id: string;
  is_favourite: boolean;
}
