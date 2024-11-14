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
const toolComponent: TipsItem[] = [
  {
    id: '3',
    title: 'Cách Mài Dao Đúng Cách Để Dao Luôn Sắc Bén',
    description:
      'Để dao luôn sắc bén, bạn nên sử dụng đá mài và đảm bảo góc mài từ 15-20 độ. Hãy mài nhẹ nhàng từ cả hai mặt của lưỡi dao, điều này giúp dao sắc bén và dễ dàng sử dụng trong nhà bếp.',
    imageUrl:
      'https://www.btaskee.com/wp-content/uploads/2021/03/cach-mai-dao-inox.jpg',
    category: 'Dụng cụ bếp', // /tips/tools
  },
  {
    id: '7',
    title: 'Cách Sử Dụng Nồi Áp Suất An Toàn',
    description:
      'Nồi áp suất là công cụ hữu ích trong nhà bếp nhưng cần sử dụng đúng cách. Hãy luôn kiểm tra van an toàn trước khi nấu, không nên đổ quá 2/3 dung tích nồi và để cho áp suất giảm tự nhiên trước khi mở nắp.',
    imageUrl:
      'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_7993/7993.png?version=081741',
    category: 'Dụng cụ bếp', // /tips/tools
  },
];

const ToolComponent: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Dụng cụ bếp');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <div className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Dụng cụ bếp</h2>
          <p className="text-gray-600 text-lg mb-8">
            Dụng cụ bếp tiện ích - Trợ thủ đắc lực của mọi đầu bếp !
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
          {toolComponent.map((tipsItem) => (
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
export default ToolComponent;
