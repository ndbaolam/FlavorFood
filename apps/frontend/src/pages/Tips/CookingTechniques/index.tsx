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

const cookingTechnique: TipsItem[] = [
  {
    id: '1',
    title: 'Kỹ Thuật Xào Rau Giòn Xanh',
    description:
      'Để rau xào giòn và giữ màu xanh, hãy xào rau trên lửa lớn và tránh xào quá lâu. Ngoài ra, hãy chần qua rau trước khi xào và thêm một chút muối trong khi xào để giữ được màu sắc tươi sáng.',
    imageUrl:
      'https://danviet.mediacdn.vn/296231569849192448/2022/6/5/xao-rau-3-16544111185471342347952-16544111440061006143290.jpeg',
    category: 'Kỹ thuật nấu ăn', // /tips/techniques
  },
  {
    id: '2',
    title: 'Kỹ Thuật Cắt Thái Rau Củ Đúng Cách',
    description:
      'Học cách cắt thái rau củ thành những miếng đều nhau giúp thực phẩm chín đồng đều và giữ nguyên được hương vị. Sử dụng kỹ thuật cắt phù hợp như thái lát, thái hạt lựu để tạo ra món ăn ngon và bắt mắt hơn.',
    imageUrl:
      'https://www.cet.edu.vn/wp-content/uploads/2018/07/lam-sach-thot-va-dao.jpg',
    category: 'Kỹ thuật nấu ăn', // /tips/techniques
  },
];
const CookingTechniques: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Kỹ thuật nấu ăn');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <div className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Kỹ thuật nấu ăn</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá nghệ thuật và kỹ thuật để chinh phục gian bếp !
          </p>
        </div>

        {/* Thêm FilterTipsItem */}
        <div className="flex justify-center items-center ">
          <FilterTips
            activeFilter={activeFilter}
            setActiveFilter={(filter: string) => {
              setActiveFilter(filter);
              // Điều hướng đến route tương ứng dựa trên filter
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
          {cookingTechnique.map((tipsItem) => (
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
export default CookingTechniques;
