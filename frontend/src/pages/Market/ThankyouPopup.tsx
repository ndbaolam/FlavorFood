import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import InvoicePopup from '../../components/InvoicePopup';

interface ThankYouProps {
  onClose: () => void;
  userId: number;
}

const ThankYou: React.FC<ThankYouProps> = ({ onClose, userId }) => {
  const [userInvoices, setUserInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(`/invoice?userId=${userId}`);
        setUserInvoices(response.data || []);
        console.log('Hóa đơn của người dùng:', response.data);
      } catch (error) {
        console.error('Lỗi khi lấy hóa đơn của người dùng:', error);
        setUserInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchInvoices();
    }
  }, [userId]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
        <div className="relative max-w-xl w-full bg-white p-10 rounded-xl shadow-xl border border-green-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Cảm ơn bạn đã đăng ký!
            </h1>
            <p className="text-lg text-black mb-4">
              Thanh toán của bạn đã được xử lý thành công.
            </p>
            <p className="text-lg text-black mb-6 text-center">
              Chúng tôi đã nâng cấp tài khoản của bạn thành <strong>Quản lý cửa hàng</strong>. Hãy bắt đầu hành trình kinh doanh tuyệt vời ngay bây giờ!
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <a
              href="/store-registration"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Quay về cửa hàng của bạn
            </a>

            <button
              onClick={() => setShowInvoicePopup(true)}
              disabled={loading || userInvoices.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Đang tải...' : 'Xem hóa đơn'}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6 italic text-center">
            Mọi thắc mắc, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </div>
      </div>

      {showInvoicePopup && (
        <InvoicePopup
          invoices={userInvoices}
          onClose={() => setShowInvoicePopup(false)}
        />
      )}
    </>
  );
};

export default ThankYou;
