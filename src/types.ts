export interface StageInfo {
  id: 'orbit' | 'spire' | 'penthouse';
  number: string;
  name: string;
  altitude: string;
  headline: string;
  subheadline: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  subtitle: string;
  description: string;
  detail: string;
}

export interface ViewingFormData {
  fullName: string;
  email: string;
  phone: string;
  residenceType: string;
  preferredDate: string;
  preferredTime: string;
  representation: 'private' | 'broker' | 'family_office';
  specialRequests: string;
}

export interface WeatherData {
  location: string;
  area: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  usAqi?: number;
  aqiCategory?: string;
  updatedAt: string;
  source?: string;
  isSimulated?: boolean;
}
