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
}

export interface Ingredient {
  ingredient_id: number;
  title: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}