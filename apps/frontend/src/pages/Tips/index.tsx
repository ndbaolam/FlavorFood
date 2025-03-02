import React, { useEffect, useState } from 'react';
import FilterTips from '../../components/FilterTips';
import TipsCard from '../../components/TipsCard';
import { TipsItem } from './Tip.interface';
import axiosInstance from '../../services/axiosInstance';

const Tips: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [tips, setTips] = useState<TipsItem[]>([]);

  // Hàm lấy dữ liệu Tips và lọc theo Genre
  const fetchTips = async () => {
    try {
      const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
        withCredentials: true,
      });

      // Lọc dữ liệu nếu có activeGenre
      if (activeGenre) {
        const filteredTips = response.data.filter(tip =>
          tip.genres.some(genre => genre.genre_id === activeGenre)
        );
        setTips(filteredTips);
      } else {
        setTips(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tip:', error);
    }
  };

  // Gọi lại hàm fetchTips khi activeGenre thay đổi
  useEffect(() => {
    fetchTips();
  }, [activeGenre]);

  return (
    <div className="min-h-screen max-w-screen">
      <main className="container mx-auto">
        <section className="text-center relative mt-20">
          <h2 className="text-4xl font-bold mb-2">Mẹo nhà bếp </h2>
          <p className="text-gray-600 text-lg mb-8">
            Tận dụng mọi góc bếp - Nấu ăn thông minh, tiết kiệm thời gian!
          </p>
        </section>

        <section className="flex justify-center items-center">
          <FilterTips
            activeFilter={activeGenre}
            setActiveFilter={setActiveGenre}
          />
        </section>

        {/* Tips Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {tips.map((tip) => (
            <TipsCard key={tip.tip_id} tips={tip} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Tips;