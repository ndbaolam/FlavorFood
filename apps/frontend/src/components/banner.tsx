import React from "react";
import { useNavigate } from 'react-router-dom';

const Banner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between bg-gradient-to-b from-blue-100 to-white relative overflow-hidden">
      {/* Phần bên trái - Nội dung văn bản */}
      <div className="flex flex-col items-start md:mr-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Khám phá món ngon mỗi ngày
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          Hàng trăm công thức nấu ăn đa dạng, giúp bạn nấu những món ngon dễ dàng hơn mỗi ngày!
        </p>
        <button
          className="bg-red-500 px-6 py-3 text-white font-medium text-lg rounded-full shadow-md transition-transform duration-300 hover:bg-red-600 hover:scale-105"
          onClick={() => navigate('/dish')}
        >
          Khám phá ngay
        </button>
      </div>

      {/* Phần bên phải - Hình ảnh */}
      <div className="flex-1 flex flex-col items-center md:items-end relative">
        {/* Hình ảnh lớn - phía trên */}
        <div className="mb-4">
          <img
            src="https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish4-min.png" // Thay thế bằng URL hình ảnh chính xác
            alt="Món ăn chính"
            className="w-[250px] h-[250px] object-cover "
          />
        </div>

        {/* Hình ảnh nhỏ - phía dưới */}
        <div className="flex gap-10">
          {/* Hình ảnh nhỏ thứ nhất */}
          <div>
            <img
              src="https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish3-min.png" 
              alt="Món ăn phụ 1"
              className="w-[140px] h-[140px] object-cover"
            />
          </div>

          {/* Hình ảnh nhỏ thứ hai */}
          <div>
            <img
              src="https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish5-min.png" 
              alt="Món ăn phụ 2"
              className="w-[140px] h-[140px] object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
