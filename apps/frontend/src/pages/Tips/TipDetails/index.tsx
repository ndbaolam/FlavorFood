import { ChefHat } from 'lucide-react';
import formatString from '../../../services/formatString';

import { Link, useParams } from "react-router-dom";

interface TipsItem {
    tips_id: string; // Change this to match the property in the object
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
export default function TipDetails() {
    const {slug} = useParams<{slug:string}>();

    const tips= tipsItems.find((r) => formatString(r.title) === slug);

    if(!tips){
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">Không tìm thấy mẹo nhà bếp</h1>
        <p className="text-gray-600 mb-4">
          Chúng tôi không thể tìm thấy mẹo nhà bếp bạn yêu cầu.
        </p>
        <Link to="/dish" className="text-blue-500 hover:underline hover:text-blue-700">
          Quay lại tất cả.
        </Link>
      </div>
    );
}
return (
<div className='min-h-screen py-12 bg-white'>
    <main className='container mx-auto px-4'>
    <article>
        <div className='text-left flex flex-wrap items-center gap-20'>
            <h1 className='text-3xl font-bold mb-4'>{tips.title}</h1>
         
            <div className='flex items-center gap-2 mb-4'>
            <ChefHat className="w-6 h-6 text-black"/>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{tips.tag}</span>
            </div>
        </div>


        <div className="flex justify-between w-fit mt-12">
           <img 
           src={tips.image}
           alt={tips.title}
           />
        </div>

        <div className='mt-12'>
          <p className='text-black'>{tips.description}</p>

        </div>
    </article>
    </main>

</div>
);
}