 export interface Store {
    id: number;
    name: string;
    location: [number, number]; 
    address: string;
    description: string;
    openHours: string;
    closeHours: string;
    ingredients: Ingredient[];
    distance?: number | null;
    phone: string; 
  }

export interface Ingredient {
    name: string;
    quantity: number;
    price: number;
}