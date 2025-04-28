import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";


interface CommentFormProps {
  recipeId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ recipeId }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance
      .get("/auth/profile", {
        withCredentials: true,
      })
      .then((response) => {
        setUserId(response.data?.user_id);
        console.log("User ID:", response.data?.user_id);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast.error("Lỗi khi tải thông tin người dùng!", { position: "top-right", autoClose: 2000 });
      });
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment) {
      toast.error("Vui lòng nhập bình luận!", { position: "top-right", autoClose: 2000 });
      return;
    }
    if (!userId) {
      toast.error("Bạn cần đăng nhập để bình luận", { position: "top-right", autoClose: 2000 });
      return;
    }
    if (rating === 0) {
      toast.error("Vui lòng chọn mức đánh giá!", { position: "top-right", autoClose: 2000 });
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post(
        "/reviews",
        {
          recipeId, 
          userId,
          rating,
          comment,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Bình luận thành công!", { position: "top-right", autoClose: 2000 });
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!", { position: "top-right", autoClose: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 ">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá món ăn</h3>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-700" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        placeholder="Viết bình luận của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
};

export default CommentForm;
