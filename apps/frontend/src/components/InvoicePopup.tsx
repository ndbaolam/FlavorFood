import React from 'react';
import { X } from 'lucide-react';
import { formatTime } from '../utils/fomatDate';
import { formatCurrency } from '../utils/fomatPrice';

interface InvoicePopupProps {
  invoices: any[];
  onClose: () => void;
}

const InvoicePopup: React.FC<InvoicePopupProps> = ({ invoices, onClose }) => {
  const user = invoices[0]?.user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">{invoices[0]?.title}</h2>

        <div className="flex justify-end">
  <button
    onClick={() => window.print()}
    className="no-print px-3 py-2 border-2 border-blue-600 text-black hover:bg-blue-50 rounded-md font-medium transition flex items-center justify-center"

  >
    In hóa đơn
  </button>
</div>

        <div className="grid grid-cols-2 gap-6 mb-6">
  {/* Thông tin người dùng */}
  <div>
    <h3 className="text-lg font-semibold mb-2">Người mua</h3>
    <p><strong>Họ tên:</strong> {user?.first_name} {user?.last_name}</p>
    <p><strong>Email:</strong> {user?.mail}</p>
  </div>

  {/* Thông tin người bán */}
  <div>
    <h3 className="text-lg font-semibold mb-2">Người bán</h3>
    <p><strong>Họ tên:</strong> Đinh Minh Ánh</p>
    <p><strong>Email:</strong> anhdinh@gmail.com</p>
  </div>
</div>


        {invoices.length === 0 ? (
          <p className="text-gray-600">Không có hóa đơn nào.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Gói</th>
                <th className="px-3 py-2 text-left">Mô tả</th>
                <th className="px-3 py-2 text-left">Ngày tạo</th>
                <th className="px-3 py-2 text-left">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">{invoice.subscription?.title || 'N/A'}</td>
                  <td className="px-3 py-2 whitespace-pre-line">{invoice.subscription?.description}</td>
                  <td className="px-3 py-2">
                  {new Date(invoice.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(invoice.subscription?.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoicePopup;
