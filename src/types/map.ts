export interface Location {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  icon?: string;
}

export interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  styles?: any[];
}

export interface MarkerOptions {
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  icon?: string;
  animation?: any;
  label?: {
    text: string;
    color: string;
    fontWeight: string;
  };
}

export interface MapProps {
  locations: Location[];
  defaultZoom?: number;
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  onMarkerClick?: (location: Location) => void;
  apiKey?: string;
} 