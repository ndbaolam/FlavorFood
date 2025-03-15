
export interface Recipe {
    recipe_id: number;
    title: string;
    description: string;
    time: string;
    calories: number;
    image: string;
    categories: Category[];
    ingredients: Ingredient[];
    steps: Step[];
    serving: number;
    difficulty_level: 'Dễ' | 'Trung bình' | 'Khó';
    nutrition: Nutrition[];
    ratings?: { averageRating: number; reviews: number };
    isFavorite?: boolean;
}

export interface Ingredient {
    id: number;
    ingredient: string;
    quantity: string;
    unit: string;
}

export interface Category {
    category_id: number;
    title: string;
}

export interface Step {
    number: number;
    step: string;
}

export interface Nutrition {
    id: number;        
    name: string;      
    amount: number;     
    unit: string; 
}