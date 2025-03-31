
export interface Recipe {
    recipe_id: number;
    title: string;
    description: string;
    time: number; 
    image: string;
    categories: Category[];
    ingredients: Ingredient[];
    steps: Step[];
    serving: number;
    difficulty_level: 'Dễ' | 'Trung bình' | 'Khó';
    nutrition: Nutrition[];
    rating: { averageRating: number; reviews: number };
    isFavorite?: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Ingredient {
    id: number;
    ingredient: string;
    quantity: number;
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