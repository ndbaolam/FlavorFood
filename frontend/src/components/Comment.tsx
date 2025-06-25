import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/auth";

interface CommentFormProps {
  recipeId: number;
  onCommentCreated: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ recipeId, onCommentCreated }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Vui lòng nhập bình luận!", { position: "top-right", autoClose: 2000 });
      return;
    }

    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
      toast.info("Bạn cần đăng nhập để bình luận!", { position: "top-right", autoClose: 2000 });
      navigate("/sign-in", { state: { returnTo: window.location.pathname } });
      return;
    }
    if (!comment.trim() && rating === 0) {
      toast.error("Vxui lòng nhập bình luận và chọn mức đánh giá!", { position: "top-right", autoClose: 3000 });
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
      onCommentCreated();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!", { position: "top-right", autoClose: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 ">
      <h3 className="text-xl font-semibold text-black mb-4">Đánh giá món ăn</h3>

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
        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        placeholder="Viết bình luận của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}

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
