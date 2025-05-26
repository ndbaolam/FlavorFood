import React from 'react';
import { useNavigate } from 'react-router-dom';
import formatString from '../utils/formatString';
import { TipsItem } from '../pages/Tips/tip.interface';

interface TipsCardProps {
  tips: TipsItem;
  currentCategoryPath?: string;
  onToggleFavorite?: (tips_id: string) => void;
}

const TipsCard: React.FC<TipsCardProps> = ({ tips, currentCategoryPath, onToggleFavorite }) => {
  const navigate = useNavigate();
  const formattedTitle = formatString(tips.title);
  const linkto = `/tips/${formattedTitle}_${tips.tip_id}.html`;

  return (
    <div 
      className="bg-gradient-to-b from-blue-50 to-white shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-full rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(linkto)}
    >
      <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
        <img
          src={tips.thumbnail}
          alt={tips.title}
          className="w-full h-44 object-cover transform origin-center rounded-t-xl"
        />
      </div>

      <div className="flex flex-col items-center p-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300">
          {tips.title}
        </h2>

        <p className="text-gray-600 text-center mb-4 text-sm line-clamp-5 overflow-hidden text-ellipsis" dangerouslySetInnerHTML={{ __html: tips.content.replace(/(\d+\.\s[^<]+)/g, '<strong>$1</strong>') }} />
      </div>
    </div>
  );
};

export default TipsCard;