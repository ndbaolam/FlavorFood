import React from "react";
import { Coffee, Salad, GlassWater, Cake } from "lucide-react";

const Home: React.FC = () => {
  const menuItems = [
    {
      icon: Coffee,
      title: "Bữa sáng",
      description: "Khởi đầu ngày mới tràn đầy năng lượng với bữa sáng dinh dưỡng!",
      link: "#breakfast",
    },
    {
      icon: Salad,
      title: "Món chay",
      description: "Chay thanh đạm, hương vị ngọt ngào – Sống xanh, sống khỏe mỗi ngày!",
      link: "#vegetarian",
    },
    {
      icon: GlassWater,
      title: "Đồ uống",
      description: "Thức uống tươi mát, bổ sung sức sống – Khơi dậy mọi giác quan!",
      link: "#drinks",
    },
    {
      icon: Cake,
      title: "Tráng miệng",
      description: "Ngọt ngào từng miếng, thỏa mãn mọi cảm xúc – Tráng miệng là niềm vui cuối cùng!",
      link: "#desserts",
    },
  ];

  const topItems = [
    {
      image: "https://file.hstatic.net/200000610729/file/suon-1_45d8812e98a24c97a7920ebdf8457d11.jpg",
      title: "Sườn xào chua ngọt",
      
      description: "Thành phần: Sườn heo, tỏi, hành khô, hạt nêm, nước mắm, đường, tiêu xay, sốt BBQ, dầu ăn, and rau sống.",
    },
    {
      image: "https://static-images.vnncdn.net/files/publish/canh-ga-chien-nuoc-mam-don-gian-tuyet-ngon-cho-bua-com-nha-76e74a6565574ce8b848041b0e711fe0.jpg",
      title: "Cánh gà chiên mắm",
      
      description: "Thành phần: Cánh gà, tỏi, hành khô, mắm, đường, tiêu xay, và dầu ăn.",
    },
    {
      image: "https://daynauan.info.vn/wp-content/uploads/2018/06/thit-kho-tau-1.jpg",
      title: "Thịt kho tàu",
      
      description: "Thành phần: Thịt heo, trứng, nước mắm, đường, hành tím, tỏi, tiêu, và nước dừa.",
    },
    {
      image: "https://cdn.tgdd.vn/Files/2019/11/12/1218206/cach-lam-thit-bo-xao-hanh-tay-thom-mem-nhanh-gon-202212091417101425.jpg",
      title: "Thịt bò xào hành tây",
      
      description: "Thành phần: Thịt bò, hành tây, tỏi, nước tương, tiêu, và dầu ăn.",
    },
    {
      image: "https://file.hstatic.net/200000610729/file/suon-1_45d8812e98a24c97a7920ebdf8457d11.jpg",
      title: "Sườn xào chua ngọt",
      
      description: "Thành phần: Sườn heo, tỏi, hành khô, hạt nêm, nước mắm, đường, tiêu xay, sốt BBQ, dầu ăn, and rau sống.",
    },
    {
      image: "https://static-images.vnncdn.net/files/publish/canh-ga-chien-nuoc-mam-don-gian-tuyet-ngon-cho-bua-com-nha-76e74a6565574ce8b848041b0e711fe0.jpg",
      title: "Cánh gà chiên mắm",
      
      description: "Thành phần: Cánh gà, tỏi, hành khô, mắm, đường, tiêu xay, và dầu ăn.",
    },
    {
      image: "https://daynauan.info.vn/wp-content/uploads/2018/06/thit-kho-tau-1.jpg",
      title: "Thịt kho tàu",
      
      description: "Thành phần: Thịt heo, trứng, nước mắm, đường, hành tím, tỏi, tiêu, và nước dừa.",
    },
    {
      image: "https://cdn.tgdd.vn/Files/2019/11/12/1218206/cach-lam-thit-bo-xao-hanh-tay-thom-mem-nhanh-gon-202212091417101425.jpg",
      title: "Thịt bò xào hành tây",
      
      description: "Thành phần: Thịt bò, hành tây, tỏi, nước tương, tiêu, và dầu ăn.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-screen">
      <main className="container mx-auto py-8">
        <img
          src="./home.png"
          className="rounded-md shadow-lg hover:scale-105 transition-all ease-in-out"
          alt="Home banner"
        />
        
        <div className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold">Thực đơn hôm nay</h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map(({ icon: Icon, title, description, link }) => (
              <div
                key={title}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-all ease-in-out"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <a
                  href={link}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Khám phá
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12">
          <h2 className="text-4xl font-semibold text-center mb-8">Món ăn thịnh hành</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-all ease-in-out"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />

                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;