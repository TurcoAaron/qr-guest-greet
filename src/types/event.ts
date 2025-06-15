
export interface EventImage {
  id?: string;
  image_url: string;
  preference: number;
  file?: File; // For client-side tracking of new uploads
}
