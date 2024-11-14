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

const storage: TipsItem[] = [
    {
        id: '1',
        title: 'Bảo Quản Hành Tây Để Không Bị Mềm',
        description:
          'Hành tây nên được bảo quản ở nơi khô ráo và thoáng khí. Hãy đặt chúng trong một túi lưới hoặc giỏ có lỗ thoát khí, tránh nơi ẩm ướt hoặc kín, giúp hành tây giữ độ giòn lâu hơn và không bị mốc.',
        imageUrl:
          'https://file.hstatic.net/200000868155/file/huong-dan-cach-bao-quan-hanh-tay-tuoi-lau-nhat-17-10-2022-1.jpg',
        category: 'Bảo quản nguyên liệu', // /tips/storage
      },
      {
        id: '2',
        title: 'Cách Giữ Trái Cây Không Bị Thâm',
        description:
          'Để trái cây như táo, lê không bị thâm sau khi cắt, hãy vắt một chút nước chanh lên bề mặt. Axit trong chanh sẽ giúp giữ màu sắc tự nhiên của trái cây lâu hơn.',
        imageUrl:
          'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/186490/Originals/cach-bao-quan-tao-khong-bi-tham-2.jpg',
        category: 'Bảo quản nguyên liệu', // /tips/storage
      },
  ];
const Storage: React.FC =() => {
    const [activeFilter, setActiveFilter] = useState<string>('Bảo quản nguyên liệu');
  const navigate = useNavigate();
    return (
        <div className="min-h-screen">
            <main className="container mx-auto">
            <div className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Bảo quản nguyên liệu</h2>
          <p className="text-gray-600 text-lg mb-8">
          Giữ nguyên liệu tươi ngon - Tận hưởng món ăn trọn vị  !
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
          {storage.map((tipsItem) => (
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
export default Storage;