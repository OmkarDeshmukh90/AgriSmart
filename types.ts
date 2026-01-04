
export enum NavTab {
  DASHBOARD = 'dashboard',
  SCANNER = 'scanner',
  MARKET = 'market',
  IRRIGATION = 'irrigation',
  COMMUNITY = 'community',
  CROP_PLAN = 'crop_plan',
  NOTIFICATIONS = 'notifications',
  RECOMMENDATION = 'recommendation',
  PROFILE = 'profile'
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  MISSED = 'missed',
  REMIND = 'remind',
  UPCOMING = 'upcoming'
}

export interface FarmTask {
  id: string;
  title: string;
  description: string;
  quantitySuggestion: string;
  status: TaskStatus;
  date: string;
  category: 'fertilizer' | 'irrigation' | 'pesticide' | 'harvest';
}

export interface FarmerProfile {
  name: string;
  village: string;
  landSize: number;
  unit: 'Acres' | 'Hectares';
  irrigationType: string;
  waterSource: string;
  location: { lat: number; lng: number };
  soil?: {
    n: string;
    p: string;
    k: string;
    ph: string;
    cardImage: string | null;
  };
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  location: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  condition: string;
}

export interface MarketPrice {
  name: string;
  price: number;
  change: number;
  unit: string;
  history: { date: string; value: number }[];
  mandi: string;
  recommendation: 'SELL' | 'WAIT';
  reason: string;
  img: string;
  storageAdvice?: {
    safeDuration: string;
    projectedGain: string;
    condition: string;
  };
  alternatives?: {
    mandi: string;
    price: number;
    distance: string;
  }[];
}

export interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  treatment: string;
}

export interface Post {
  id: string;
  author: string;
  role: string;
  type: 'expert' | 'official' | 'farmer';
  content: string;
  likes: number;
  comments: number;
  time: string;
  tag: string;
}

export type NotificationType = 'like' | 'comment' | 'post' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

export interface CropStage {
  id: string;
  name: string;
  duration: string;
  progress: number;
  status: 'completed' | 'active' | 'upcoming';
  tasks: string[];
  icon: string;
  description: string;
}

export interface RecommendedCrop {
  id: string;
  name: string;
  icon: string;
  image: string;
  expectedProfit: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  duration: string;
  cost: string;
  waterRequirement: string;
  pestSusceptibility: 'Low' | 'Medium' | 'High';
  yield: string;
  sellingPrice: string;
}
