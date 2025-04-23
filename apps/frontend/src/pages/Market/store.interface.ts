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
    phone: string; 
    image:string,
  }

export interface Ingredient {
  food_id: number;
  title: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}