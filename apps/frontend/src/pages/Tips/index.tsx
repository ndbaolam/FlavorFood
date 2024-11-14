import React, { useState } from 'react';
import FilterTips from '../../components/FilterTips';
import { filter } from 'rxjs';

interface TipsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFavorite?: boolean;
}
const tipsItems: TipsItem[] = [
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
    title: 'Kỹ Thuật Cắt Thái Rau Củ Đúng Cách',
    description:
      'Học cách cắt thái rau củ thành những miếng đều nhau giúp thực phẩm chín đồng đều và giữ nguyên được hương vị. Sử dụng kỹ thuật cắt phù hợp như thái lát, thái hạt lựu để tạo ra món ăn ngon và bắt mắt hơn.',
    imageUrl:
      'https://www.cet.edu.vn/wp-content/uploads/2018/07/lam-sach-thot-va-dao.jpg',
    category: 'Kỹ thuật nấu ăn', // /tips/techniques
  },
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
    id: '4',
    title: 'Cách Làm Sạch Lò Nướng Bằng Baking Soda',
    description:
      'Trộn baking soda với nước để tạo thành hỗn hợp, sau đó bôi đều lên bề mặt lò nướng. Để qua đêm và sau đó lau sạch lại bằng khăn ẩm để loại bỏ dầu mỡ và mảng bám cứng đầu một cách dễ dàng.',
    imageUrl:
      'https://cdn.tgdd.vn/2021/12/CookDish/cach-ve-sinh-lo-nuong-bang-baking-soda-cuc-don-gian-an-toan-avt-1200x676.jpg',
    category: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
  {
    id: '5',
    title: 'Cách Giữ Trái Cây Không Bị Thâm',
    description:
      'Để trái cây như táo, lê không bị thâm sau khi cắt, hãy vắt một chút nước chanh lên bề mặt. Axit trong chanh sẽ giúp giữ màu sắc tự nhiên của trái cây lâu hơn.',
    imageUrl:
      'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/186490/Originals/cach-bao-quan-tao-khong-bi-tham-2.jpg',
    category: 'Bảo quản nguyên liệu', // /tips/storage
  },
  {
    id: '6',
    title: 'Kỹ Thuật Xào Rau Giòn Xanh',
    description:
      'Để rau xào giòn và giữ màu xanh, hãy xào rau trên lửa lớn và tránh xào quá lâu. Ngoài ra, hãy chần qua rau trước khi xào và thêm một chút muối trong khi xào để giữ được màu sắc tươi sáng.',
    imageUrl:
      'https://danviet.mediacdn.vn/296231569849192448/2022/6/5/xao-rau-3-16544111185471342347952-16544111440061006143290.jpeg',
    category: 'Kỹ thuật nấu ăn', // /tips/techniques
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
  {
    id: '8',
    title: 'Cách Làm Sạch Chảo Gang Không Bị Gỉ',
    description:
      'Sau khi sử dụng chảo gang, hãy rửa sạch và lau khô hoàn toàn. Bạn cũng có thể bôi một lớp dầu mỏng lên bề mặt để bảo vệ chảo không bị gỉ sét, giữ cho chảo luôn trong tình trạng tốt nhất.',
    imageUrl:
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_8_9_638271967182488300_chao-gang-bi-ri-set-0.jpg',
    category: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
];

const Tips: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả');

  const filterTipsItem = tipsItems.filter((tipsItems) => {
    if (activeFilter === 'Tất cả') return true;
    return tipsItems.category === activeFilter;
  });
  return (
    <div className="min-h-screen  max-w-screen">
      <main className="container mx-auto">
        <div className="text-center relative mt-20">
          <h2 className="text-4xl font-bold mb-2">Mẹo nhà bếp </h2>
          <p className="text-gray-600 text-lg mb-8">
            Tận dụng mọi góc bếp - Nấu ăn thông minh, tiết kiệm thời gian!
          </p>
        </div>

        <div className="flex justify-center items-center ">
          {/* Pass the activeFilter and the setter function to FilterMenu */}
          <FilterTips
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {filterTipsItem.map((tipsItem) => (
            <div key={tipsItem.id} className="relative">
              <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-full">
                {/* Chứa Hình Ảnh */}
                <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={tipsItem.imageUrl}
                    alt={tipsItem.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
                {/* Chứa Tiêu Đề và Mô Tả */}
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
export default Tips;
