# hybrid_recommendations.py
from collaborative_filtering import get_collaborative_recommendations
from favorite_based import get_favorite_based_recommendations
import pandas as pd

# Hàm kết hợp gợi ý từ cả hai phương pháp
def get_hybrid_recommendations(user_id, user_recipe_matrix, user_similarity_df, favorite, recipes, recipe_similarity_matrix, top_n=5):
    # Lấy gợi ý từ phương pháp Collaborative Filtering
    collab_recs = get_collaborative_recommendations(user_id, user_recipe_matrix, user_similarity_df, top_n=top_n)
    
    # Lấy gợi ý từ phương pháp Favorite-Based Recommendations
    favorite_recs = get_favorite_based_recommendations(user_id, favorite, recipes, recipe_similarity_matrix, top_n=top_n)
    
    # Kết hợp cả hai kết quả, loại bỏ trùng lặp
    hybrid_recs = pd.concat([collab_recs, favorite_recs]).drop_duplicates(subset='recipe_id')
    return hybrid_recs.head(top_n)
