 import React, { useState } from 'react';
 import FilterTips from '../../components/FilterTips';
 import TipsCard from '../../components/TipsCard';
 
 interface TipsItem {
   tips_id: string;
   title: string;
   description: string;
   image: string;
   tag: string;
   isFavorite?: boolean;
 }
 
 const tipsItems: TipsItem[] = [
  {
    tips_id: '1', // Changed from 'id' to 'tips_id'
    title: 'Bảo Quản Hành Tây Để Không Bị Mềm',
    description:
      'Hành tây nên được bảo quản ở nơi khô ráo và thoáng khí. Hãy đặt chúng trong một túi lưới hoặc giỏ có lỗ thoát khí, tránh nơi ẩm ướt hoặc kín, giúp hành tây giữ độ giòn lâu hơn và không bị mốc.',
    image:
      'https://file.hstatic.net/200000868155/file/huong-dan-cach-bao-quan-hanh-tay-tuoi-lau-nhat-17-10-2022-1.jpg',
    tag: 'Bảo quản nguyên liệu', // /tips/storage
  },
  {
    tips_id: '2', // Changed from 'id' to 'tips_id'
    title: 'Kỹ Thuật Cắt Thái Rau Củ Đúng Cách',
    description:
      'Học cách cắt thái rau củ thành những miếng đều nhau giúp thực phẩm chín đồng đều và giữ nguyên được hương vị. Sử dụng kỹ thuật cắt phù hợp như thái lát, thái hạt lựu để tạo ra món ăn ngon và bắt mắt hơn.',
    image:
      'https://www.cet.edu.vn/wp-content/uploads/2018/07/lam-sach-thot-va-dao.jpg',
    tag: 'Kỹ thuật nấu ăn', // /tips/techniques
  },
  {
    tips_id: '3', // Changed from 'id' to 'tips_id'
    title: 'Cách Mài Dao Đúng Cách Để Dao Luôn Sắc Bén',
    description:
      'Để dao luôn sắc bén, bạn nên sử dụng đá mài và đảm bảo góc mài từ 15-20 độ. Hãy mài nhẹ nhàng từ cả hai mặt của lưỡi dao, điều này giúp dao sắc bén và dễ dàng sử dụng trong nhà bếp.',
    image:
      'https://www.btaskee.com/wp-content/uploads/2021/03/cach-mai-dao-inox.jpg',
    tag: 'Dụng cụ bếp', // /tips/tools
  },
  {
    tips_id: '4', // Changed from 'id' to 'tips_id'
    title: 'Cách Làm Sạch Lò Nướng Bằng Baking Soda',
    description:
      'Trộn baking soda với nước để tạo thành hỗn hợp, sau đó bôi đều lên bề mặt lò nướng. Để qua đêm và sau đó lau sạch lại bằng khăn ẩm để loại bỏ dầu mỡ và mảng bám cứng đầu một cách dễ dàng.',
    image:
      'https://cdn.tgdd.vn/2021/12/CookDish/cach-ve-sinh-lo-nuong-bang-baking-soda-cuc-don-gian-an-toan-avt-1200x676.jpg',
    tag: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
  {
    tips_id: '5', // Changed from 'id' to 'tips_id'
    title: 'Cách Giữ Trái Cây Không Bị Thâm',
    description:
      'Để trái cây như táo, lê không bị thâm sau khi cắt, hãy vắt một chút nước chanh lên bề mặt. Axit trong chanh sẽ giúp giữ màu sắc tự nhiên của trái cây lâu hơn.',
    image:
      'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/186490/Originals/cach-bao-quan-tao-khong-bi-tham-2.jpg',
    tag: 'Bảo quản nguyên liệu', // /tips/storage
  },
  {
    tips_id: '6', // Changed from 'id' to 'tips_id'
    title: 'Kỹ Thuật Xào Rau Giòn Xanh',
    description:
      'Để rau xào giòn và giữ màu xanh, hãy xào rau trên lửa lớn và tránh xào quá lâu. Ngoài ra, hãy chần qua rau trước khi xào và thêm một chút muối trong khi xào để giữ được màu sắc tươi sáng.',
    image:
      'https://danviet.mediacdn.vn/296231569849192448/2022/6/5/xao-rau-3-16544111185471342347952-16544111440061006143290.jpeg',
    tag: 'Kỹ thuật nấu ăn', // /tips/techniques
  },
  {
    tips_id: '7', // Changed from 'id' to 'tips_id'
    title: 'Cách Sử Dụng Nồi Áp Suất An Toàn',
    description:
      'Nồi áp suất là công cụ hữu ích trong nhà bếp nhưng cần sử dụng đúng cách. Hãy luôn kiểm tra van an toàn trước khi nấu, không nên đổ quá 2/3 dung tích nồi và để cho áp suất giảm tự nhiên trước khi mở nắp.',
    image:
      'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_7993/7993.png?version=081741',
    tag: 'Dụng cụ bếp', // /tips/tools
  },
  {
    tips_id: '8', // Changed from 'id' to 'tips_id'
    title: 'Cách Làm Sạch Chảo Gang Không Bị Gỉ',
    description:
      'Sau khi sử dụng chảo gang, hãy rửa sạch và lau khô hoàn toàn. Bạn cũng có thể bôi một lớp dầu mỏng lên bề mặt để bảo vệ chảo không bị gỉ sét, giữ cho chảo luôn trong tình trạng tốt nhất.',
    image:
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_8_9_638271967182488300_chao-gang-bi-ri-set-0.jpg',
   tag: 'Vệ sinh nhà bếp', // /tips/cleaning
  },
];
 
 const Tips: React.FC = () => {
   const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
 
   // Lọc các items dựa trên activeFilter
   const filterTipsItem = tipsItems.filter((tip) => {
     if (activeFilter === 'Tất cả') return true;
     return tip.tag === activeFilter;
   });
 
   return (
     <div className="min-h-screen max-w-screen">
       <main className="container mx-auto">
         <div className="text-center relative mt-20">
           <h2 className="text-4xl font-bold mb-2">Mẹo nhà bếp </h2>
           <p className="text-gray-600 text-lg mb-8">
             Tận dụng mọi góc bếp - Nấu ăn thông minh, tiết kiệm thời gian!
           </p>
         </div>
 
         <div className="flex justify-center items-center">
           {/* Pass the activeFilter and the setter function to FilterTips */}
           <FilterTips
             activeFilter={activeFilter}
             setActiveFilter={setActiveFilter}
           />
         </div>
 
         {/* Tips Grid */}
         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
           {filterTipsItem.length > 0 ? (
             filterTipsItem.map((tip) => (
               <TipsCard key={tip.tips_id} tips={tip} />
             ))
           ) : (
             <p className="text-center text-gray-500 col-span-full">
               Không có mẹo nào phù hợp!
             </p>
           )}
         </section>
       </main>
     </div>
   );
 };
 
 export default Tips;
 