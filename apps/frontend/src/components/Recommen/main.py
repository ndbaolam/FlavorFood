import pandas as pd
from collaborative_filtering import create_user_item_matrix, calculate_user_similarity, get_collaborative_recommendations
from favorite_based import create_recipe_tfidf, calculate_recipe_similarity, get_favorite_based_recommendations
from hybrid_recommendations import get_hybrid_recommendations

reviews = pd.DataFrame({
    'user_id': [1, 1, 2, 2, 3],
    'recipe_id': [101, 102, 101, 103, 102],
    'rating': [5, 4, 5, 3, 4],
    'timestamp': ['2023-05-01', '2023-05-02', '2023-05-02', '2023-05-03', '2023-05-04']
})

favorite = pd.DataFrame({
    'user_id': [1, 2, 1],
    'recipe_id': [101, 102, 103],
    'created_at': ['2023-05-01', '2023-05-02', '2023-05-02']
})

recipes = pd.DataFrame({
    'recipe_id': [101, 102, 103],
    'title': ['Recipe 1', 'Recipe 2', 'Recipe 3'],
    'description': ['Delicious recipe with chicken', 'Healthy recipe with vegetables', 'Tasty dessert with chocolate'],
    'rating': [4.5, 4.0, 4.8],
    'created_at': ['2023-05-01', '2023-05-02', '2023-05-03']
})

user_recipe_matrix = create_user_item_matrix(reviews)

user_similarity_df = pd.DataFrame(calculate_user_similarity(user_recipe_matrix), index=user_recipe_matrix.index, columns=user_recipe_matrix.index)

tfidf_matrix = create_recipe_tfidf(recipes)

recipe_similarity_matrix = calculate_recipe_similarity(tfidf_matrix)
collab_recs = get_collaborative_recommendations(user_id=1, 
                                                user_recipe_matrix=user_recipe_matrix, 
                                                user_similarity_df=user_similarity_df, 
                                                top_n=5)

print("Collaborative Filtering Recommendations:")
print(collab_recs)

favorite_recs = get_favorite_based_recommendations(user_id=1, 
                                                   favorite=favorite, 
                                                   recipes=recipes, 
                                                   recipe_similarity_matrix=recipe_similarity_matrix, 
                                                   top_n=5)

print("\nFavorite-Based Recommendations:")
print(favorite_recs)

hybrid_recs = get_hybrid_recommendations(user_id=1, 
                                         user_recipe_matrix=user_recipe_matrix, 
                                         user_similarity_df=user_similarity_df, 
                                         favorite=favorite, 
                                         recipes=recipes, 
                                         recipe_similarity_matrix=recipe_similarity_matrix, 
                                         top_n=5)

print("\nHybrid Recommendations:")
print(hybrid_recs)
