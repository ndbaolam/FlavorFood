import { User } from "../Profile/Profile.interface";

export interface Store {
  store_id: number;
  name: string;
  location: [number, number]; 
  address: string;
  description: string;
  openHours: string;
  closeHours: string;
  ingredients: Ingredient[];
  distance?: number | null;
  phone_number: string; 
  image:string,
  user: User;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  ingredient_id: number;
  title: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export interface Subscription {
  subscription_id: number;
  title: string;
  price: string;
  description: string;
  created_at: string;
  updated_at: string;
  invoices: any[];
  isHighlight?: boolean;
}