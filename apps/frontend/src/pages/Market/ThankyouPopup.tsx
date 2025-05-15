import React from 'react';
import { CheckCircle } from 'lucide-react'; 
interface ThankYouProps {
  onClose: () => void;
}
const ThankYou: React.FC<ThankYouProps> = ({ onClose }) => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-xl text-center border border-green-200">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Cảm ơn bạn đã đăng ký!
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Thanh toán của bạn đã được xử lý thành công.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Chúng tôi đã nâng cấp tài khoản của bạn thành <strong>Quản lý cửa hàng</strong>. Hãy bắt đầu hành trình kinh doanh tuyệt vời ngay bây giờ!
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
        >
          Tạo cửa hàng ngay
        </a>
        <p className="text-sm text-gray-500 mt-6 italic">
          Mọi thắc mắc, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
