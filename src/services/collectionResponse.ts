export type CollectionResponse<T> = T[] | {
  travelProducts?: T[];
  products?: T[];
  notifications?: T[];
  content?: T[];
};

export function collectionItems<T>(response: CollectionResponse<T>) {
  if (Array.isArray(response)) return response;
  return response.travelProducts ?? response.products ?? response.notifications ?? response.content ?? [];
}
