import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formatString from '../services/formatString';
import { TipsItem } from '../pages/Tips/Tip.interface';

interface TipsCardProps {
  tips: TipsItem;
  currentCategoryPath?: string;
  onToggleFavorite?: (tips_id: string) => void;
}

const TipsCard: React.FC<TipsCardProps> = ({ tips, currentCategoryPath, onToggleFavorite }) => {


  // Sử dụng formatString để tạo slug từ tiêu đề
  const formattedTitle = formatString(tips.title);
  const linkto = `/tips/${formattedTitle}_${tips.tip_id}.html`;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
        <img
          src={tips.thumbnail}
          alt={tips.title}
          className="w-full h-40 object-cover"
        />
      </div>

      {/* Title and Description Container */}
      <div className="flex flex-col items-center mt-4 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2">
          {tips.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-4 text-sm">{tips.content}</p>
        <div className="border-t border-gray-300 my-4 w-full"></div>

        {/* Read More Link */}
        <a
          href={linkto}
          className="mt-4 text-blue-500 font-medium hover:underline"
        >
          Đọc thêm &gt;&gt;
        </a>
      </div>
    </div>
  );
};

export default TipsCard;
