export interface StyleProfile {
  faceShape: string;
  skinTone: string;
  gender: 'Male' | 'Female' | 'Unspecified';
  undertone: 'Warm' | 'Cool' | 'Neutral';
  recommendations: {
    hair: string[];
    colors: string[];
    sunglasses: string[];
    tattoos: string[];
    // Male specific
    beard?: string[];
    // Female specific
    makeup?: string[]; // lipstick, blush combined
    earrings?: string[];
    stickers?: string[]; // bindis etc
    eyelashes?: string[];
    eyebrows?: string[];
  };
}

export interface WeeklyPlanDay {
  day: string;
  outfit: string;
  occasion: string;
}

export type StyleCategory = 'hair' | 'beard' | 'color' | 'accessory' | 'makeup' | 'tattoo' | 'eyebrows' | 'eyelashes';

export enum AppState {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
}