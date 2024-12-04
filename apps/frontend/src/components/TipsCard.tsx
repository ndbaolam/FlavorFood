import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formatString from '../services/formatString';

interface TipsItem {
  tips_id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  isFavorite?: boolean;
}

interface TipsCardProps {
  tips: TipsItem;
  currentCategoryPath?: string; 
  onToggleFavorite?: (tips_id: string) => void;  
}

const TipsCard: React.FC<TipsCardProps> = ({ tips, currentCategoryPath, onToggleFavorite }) => {
  const [isLiked, setIsLiked] = useState<boolean>(tips.isFavorite || false); 
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  
  // Sử dụng formatString để tạo slug từ tiêu đề
  const formattedTitle = formatString(tips.title);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
        <img
          src={tips.image}
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
        <p className={`text-gray-600 text-center mb-4 text-sm ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
          {tips.description}
        </p>

        {/* Read More Link */}
        <a 
          href={`/tips/${formattedTitle}.html`} 
          className="mt-4 text-blue-500 font-medium hover:underline"
        >
          Đọc thêm &gt;&gt;
        </a>
      </div>
    </div>
  );
};

export default TipsCard;
