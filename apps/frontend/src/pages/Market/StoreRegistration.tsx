import React, { useState } from 'react';
import { Check } from 'lucide-react';

const StoreRegistration = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const packageFeatures = [
    "Hiển thị cửa hàng trên bản đồ",
    "Quản lý số lượng nguyên liệu không giới hạn",
    "Được gợi ý nguyên liệu phù hợp",
    "Hỗ trợ 24/7",
    "Tích hợp đặt hàng online",
    "Thanh toán trực tuyến"
  ];

  const terms = [
    "Cửa hàng phải cung cấp thông tin chính xác và đầy đủ",
    "Tuân thủ các quy định về an toàn thực phẩm",
    "Duy trì chất lượng dịch vụ và sản phẩm",
    "Thanh toán phí dịch vụ đúng hạn",
    "Không được sử dụng nền tảng cho mục đích bất hợp pháp"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký cửa hàng</h1>
          <p className="text-lg text-gray-600">Tham gia cùng chúng tôi để phát triển kinh doanh</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Package Column */}
          <div className="bg-gradient-to-br from-blue-300 to-indigo-500 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 h-full">
            <div className="p-8 h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Gói Đăng ký Cửa hàng</h3>
                <div className="inline-block bg-white/20 rounded-full px-6 py-2">
                  <span className="text-5xl font-bold text-white">99.000đ</span>
                  <span className="text-white/80 ml-2 text-xl">/tháng</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {packageFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center bg-white rounded-lg p-3">
                    <Check className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Terms Column */}
          <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Điều khoản và điều kiện</h2>
            <ul className="space-y-4 mb-8 flex-grow">
              {terms.map((term, index) => (
                <li key={index} className="flex items-start bg-gray-100 rounded-lg p-4">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">{term}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center bg-gray-50 rounded-lg p-4">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="terms" className="ml-3 text-gray-600 text-lg">
                Tôi đồng ý với các điều khoản và điều kiện
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            disabled={!acceptedTerms}
            className={`px-8 py-3 rounded-lg font-medium text-lg ${
              !acceptedTerms
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-900'
            }`}
          >
            Tiếp tục đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreRegistration;