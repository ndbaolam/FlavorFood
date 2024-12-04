import React from 'react';
import TipsCard from './TipsCard';
import formatString from '../services/formatString';

interface TipsItem {
  tips_id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  isFavorite?: boolean;
}

interface TipsCardListProps {
  tips: TipsItem[];
  activeFilter: string;
}

const TipsCardList: React.FC<TipsCardListProps> = ({ tips, activeFilter }) => {
  // Lọc các tips theo activeFilter (filter đang được áp dụng)
  const filteredTips = tips.filter(tip => {
    if (activeFilter === 'Tất cả') return true; // Không lọc gì nếu là 'Tất cả'
    return formatString(tip.tag) === formatString(activeFilter);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredTips.map(tip => (
        <TipsCard key={tip.tips_id} tips={tip} />
      ))}
    </div>
  );
};

export default TipsCardList;
