# collaborative_filtering.py
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def create_user_item_matrix(reviews):
    return reviews.pivot_table(index='user_id', columns='recipe_id', values='rating')

def calculate_user_similarity(user_recipe_matrix):
    return cosine_similarity(user_recipe_matrix.fillna(0))

def get_collaborative_recommendations(user_id, user_recipe_matrix, user_similarity_df, top_n=5):
    similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:]  # Bỏ qua chính người đó
    recommendations = pd.Series(dtype=np.float64)
    
    for similar_user, similarity in similar_users.items():
        similar_user_ratings = user_recipe_matrix.loc[similar_user]
        weighted_ratings = similar_user_ratings * similarity
        recommendations = recommendations.add(weighted_ratings, fill_value=0)
    
    recommendations = recommendations.drop(user_recipe_matrix.loc[user_id].dropna().index)

    return recommendations.sort_values(ascending=False).head(top_n)
