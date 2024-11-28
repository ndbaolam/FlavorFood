import React from "react";
import { useNavigate } from 'react-router-dom';

const Banner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-10 rounded-3xl shadow-lg flex flex-col lg:flex-row items-center justify-between bg-blue-50 relative overflow-hidden">
      {/* Phần bên trái - Nội dung văn bản */}
      <div className="flex flex-col items-start lg:mr-10 mb-8 lg:mb-0">
        <h2 className="text-2xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Khám phá món ngon mỗi ngày
        </h2>
        <p className="text-lg lg:text-xl text-gray-700 mb-8">
          Hàng trăm công thức nấu ăn đa dạng, giúp bạn nấu những món ngon dễ dàng hơn mỗi ngày!
        </p>
        <button
          className="bg-red-500 px-8 py-4 text-white font-semibold text-lg rounded-full shadow-lg transform transition-transform duration-300 hover:bg-red-600 hover:scale-105"
          onClick={() => navigate('/dish')}
        >
          Khám phá ngay
        </button>
      </div>

      {/* Phần bên phải - Hình ảnh */}
      <div className="flex-1 flex items-center justify-center relative ">
        {/* Hình ảnh chính lớn */}
        <div className="relative w-[280px] h-[280px] transform rotate-3 translate-x-4 translate-y-2  overflow-hidden z-10 transition-transform duration-300 hover:scale-110">
          <img
            src="https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish4-min.png"
            alt="Món ăn chính"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hình ảnh phụ bên trái, nhỏ hơn */}
        <div className="absolute -top-12 -left-10 w-[200px] h-[200px] transform -rotate-6 translate-x-2 translate-y-2 overflow-hidden z-0 transition-transform duration-300 hover:scale-105">
          <img
            src="./banner3.png"
            alt="Món ăn phụ 1"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hình ảnh phụ bên phải, khác kích thước */}
        <div className="absolute top-20 -right-12 w-[220px] h-[220px] transform rotate-6 overflow-hidden z-20 transition-transform duration-300 hover:scale-105">
          <img
            src="./banner2.png"
            alt="Món ăn phụ 2"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Banner;
