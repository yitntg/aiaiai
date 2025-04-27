export interface PlaceDetails {
  name: string;
  formatted_address: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  rating?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  price_level?: number;
  types?: string[];
  user_ratings_total?: number;
}

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  url?: string;
}

export interface PlaceSearchResponse {
  status: string;
  results: PlaceDetails[];
  next_page_token?: string;
} 