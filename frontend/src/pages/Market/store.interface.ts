import { User } from "../Profile/Profile.interface";
export interface Store {
  store_id: number;
  name: string;
  longitude: number;      
  latitude: number;        
  location: { latitude: number; longitude: number };
  address: string;
  description: string;
  openHours: string;
  closeHours: string;
  ingredients: Ingredient[];
  distance?: number | null;
  phone_number: string;
  image: string;
  user: User;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
}


export interface Ingredient {
  ingredient_id: number;
  title: string;
  price: number;
  quantity: number;
  created_at: string;
  unit: string;
  updated_at: string;
}
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