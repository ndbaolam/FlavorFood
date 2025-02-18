
export interface Recipe {
    recipe_id: number;
    title: string;
    description: string;
    time: string;
    calories: number;
    image: string;
    categories: Category[];
    ingredients: Ingredient[];
    step: Step[];
    servings: number;
    difficulty_level: 'Dễ' | 'Trung bình' | 'Khó';
    nutrition: Nutrition[];
    ratings?: { averageRating: number; reviews: number };
    isFavorite?: boolean;
}

export interface Ingredient {
    ingredient_id: number;
    description: string;
    name: string;
    unit: string;
}

export interface Category {
    category_id: number;
    title: string;
}

export interface Step {
    step_id: number;
    step_number: number;
    description: string;
}

export interface Nutrition {
    nutrition_id: number;
    calories: string;
    protein: string;
    fat: string;
    carbohydrates: string;
}