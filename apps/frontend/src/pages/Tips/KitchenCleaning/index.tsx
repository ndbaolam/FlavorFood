import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterTips from '../../../components/FilterTips';

interface TipsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFavorite?: boolean;
}

const kitchenCleaning: TipsItem[] = [
  {
    id: '1',
    title: 'Cách Làm Sạch Chảo Gang Không Bị Gỉ',
    description:
      'Sau khi sử dụng chảo gang, hãy rửa sạch và lau khô hoàn toàn. Bạn cũng có thể bôi một lớp dầu mỏng lên bề mặt để bảo vệ chảo không bị gỉ sét, giữ cho chảo luôn trong tình trạng tốt nhất.',
    imageUrl:
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_8_9_638271967182488300_chao-gang-bi-ri-set-0.jpg',
    category: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
  {
    id: '2',
    title: 'Cách Làm Sạch Lò Nướng Bằng Baking Soda',
    description:
      'Trộn baking soda với nước để tạo thành hỗn hợp, sau đó bôi đều lên bề mặt lò nướng. Để qua đêm và sau đó lau sạch lại bằng khăn ẩm để loại bỏ dầu mỡ và mảng bám cứng đầu một cách dễ dàng.',
    imageUrl:
      'https://cdn.tgdd.vn/2021/12/CookDish/cach-ve-sinh-lo-nuong-bang-baking-soda-cuc-don-gian-an-toan-avt-1200x676.jpg',
    category: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
];

const KitchenCleaning: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Vệ sinh nhà bếp');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <div className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Vệ sinh nhà bếp</h2>
          <p className="text-gray-600 text-lg mb-8">
          Gian bếp sạch - Tâm trạng thoải mái, sức khỏe an lành !
          </p>
        </div>

        {/* Thêm FilterTipsItem */}
        <div className="flex justify-center items-center ">
          <FilterTips
            activeFilter={activeFilter}
            setActiveFilter={(filter: string) => {
              setActiveFilter(filter);

              const filterPaths: { [key: string]: string } = {
                'Tất cả': '/tips',
                'Bảo quản nguyên liệu': '/tips/storage',
                'Kỹ thuật nấu ăn': '/tips/techniques',
                'Dụng cụ bếp': '/tips/tools',
                'Vệ sinh nhà bếp': '/tips/cleaning',
              };
              navigate(filterPaths[filter] || '/tips');
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {kitchenCleaning.map((tipsItem) => (
            <div key={tipsItem.id} className="relative">
              <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-full">
                <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={tipsItem.imageUrl}
                    alt={tipsItem.title}
                    className="w-full h-40 object-cover"
                  />
                </div>

                <div className="flex flex-col items-center mt-4 p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2">
                    {tipsItem.title}
                  </h2>
                  <p className="text-gray-600 text-center mb-4 text-sm line-clamp-3">
                    {tipsItem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default KitchenCleaning;
