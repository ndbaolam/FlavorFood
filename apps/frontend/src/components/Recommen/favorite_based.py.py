# favorite_based.py
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import numpy as np

# Tạo vector TF-IDF cho mô tả công thức
def create_recipe_tfidf(recipes):
    vectorizer = TfidfVectorizer(stop_words='english')
    return vectorizer.fit_transform(recipes['description'])

# Tính toán sự tương đồng giữa các công thức
def calculate_recipe_similarity(tfidf_matrix):
    return cosine_similarity(tfidf_matrix)

# Hàm gợi ý công thức dựa trên các công thức yêu thích
def get_favorite_based_recommendations(user_id, favorite, recipes, recipe_similarity_matrix, top_n=5):
    # Lấy các công thức mà người dùng yêu thích
    favorite_recipes = favorite[favorite['user_id'] == user_id]['recipe_id']
    
    # Tính toán điểm tương đồng giữa các công thức yêu thích
    similarity_scores = np.zeros(len(recipes))
    for recipe_id in favorite_recipes:
        recipe_idx = recipes[recipes['recipe_id'] == recipe_id].index[0]
        similarity_scores += recipe_similarity_matrix[recipe_idx]
    
    # Gợi ý các công thức chưa được yêu thích
    recommended_recipe_indices = np.argsort(similarity_scores)[::-1][:top_n]
    
    # Trả về các công thức gợi ý
    return recipes.iloc[recommended_recipe_indices]
