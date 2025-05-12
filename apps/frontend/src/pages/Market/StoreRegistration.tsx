import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, Store, Package, ShieldCheck } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

const StoreRegistration = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1 tháng');

  interface Subscription {
    subscription_id: number;
    title: string;
    price: string;
    description: string;
    created_at: string;
    updated_at: string;
    invoices: any[];
    isHighlight?: boolean;
  }

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axiosInstance.get('/subscriptions');
        const processedSubscriptions = res.data.map((sub: Subscription) => {
          const isYearlyPlan = sub.title.includes('năm');
          return {
            ...sub,
            isHighlight: isYearlyPlan
          };
        });
        
        // Sort by price to display cheaper plans first
        const sortedSubscriptions = processedSubscriptions.sort(
          (a: Subscription, b: Subscription) => 
            parseFloat(a.price) - parseFloat(b.price)
        );
        
        setSubscriptions(sortedSubscriptions);
        if (sortedSubscriptions.length > 0) {
          setSelectedPlan(sortedSubscriptions[0].title);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách gói:', error);
      }
    };
  
    fetchSubscriptions();
  }, []);

  const parseFeatures = (descriptionStr: string) => {
    try {
      
      const cleanedStr = descriptionStr
        .replace(/^\{/, '[')      
        .replace(/\}$/, ']');     
      
      return JSON.parse(cleanedStr);
    } catch (error) {
      console.error("Invalid JSON format:", error);
      return [];
    }
  };
  const calculateSavings = (subscription: Subscription) => {
    if (subscription.title.includes("1 tháng")) {
      return "Thanh toán hàng tháng";
    } else if (subscription.title.includes("3 tháng")) {
      return "Tiết kiệm 9%";
    } else {
      return "Tiết kiệm 17%";
    }
  };

  const terms = [
    "Cửa hàng phải cung cấp thông tin chính xác và đầy đủ",
    "Tuân thủ các quy định về an toàn thực phẩm",
    "Duy trì chất lượng dịch vụ và sản phẩm",
    "Thanh toán phí dịch vụ đúng hạn ngày 15 hàng tháng",
    "Không được sử dụng nền tảng cho mục đích bất hợp pháp",
  ];

  const features = [
    {
      icon: <Store className="h-6 w-6" />,
      title: "Xuất hiện nổi bật",
      description: "Cửa hàng của bạn sẽ được hiển thị trên bản đồ và ứng dụng di động"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Quản lý hiệu quả",
      description: "Theo dõi và quản lý nguyên liệu một cách dễ dàng và hiệu quả"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Bảo mật dữ liệu",
      description: "Thông tin của bạn được bảo mật với công nghệ mã hóa cao cấp"
    }
  ];
  const formatPrice = (price: string) => {
    return Number(price).toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Đăng ký cửa hàng</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Nâng tầm kinh doanh của bạn với nền tảng quản lý hiện đại và thông minh</p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-24">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-gray-50 text-lg font-medium text-gray-900">Chọn gói phù hợp</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.subscription_id}
              className={`relative rounded-2xl transition-all duration-300 border-2 flex flex-col ${
                selectedPlan === subscription.title
                  ? 'border-indigo-500 transform scale-105 shadow-xl'
                  : 'bg-white border-gray-200 transform scale-100 shadow-md'
              } overflow-hidden`}
            >
              {subscription.isHighlight && (
                <div className="absolute top-0 inset-x-0 py-2 bg-indigo-600 text-white text-center text-sm font-semibold">
                  <span className="inline-flex items-center">★ Được lựa chọn nhiều nhất ★</span>
                </div>
              )}

              <div className={`${subscription.isHighlight ? 'pt-4' : ''}`}>
                <div className="text-center p-6 border-b-4 border-gray-200 bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{subscription.title}</h3>
                  <div className="flex flex-col items-center justify-center mb-3">
                    <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {formatPrice(subscription.price)}đ
                    </span>
                  </div>
                  <div className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-medium bg-green-100 text-green-800">
                    {calculateSavings(subscription)}
                  </div>
                </div>

                <div className="p-6 flex flex-col h-full">
                  <p className="text-lg font-medium text-gray-900 mb-4 text-center border-b border-gray-200 pb-3">
                    Bao gồm các dịch vụ
                  </p>
                  <div className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {(() => {
                        const features = parseFeatures(subscription.description);
                        return Array.isArray(features) ? features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        )) : (
                          <li className="text-gray-500">Không có thông tin chi tiết</li>
                        );
                      })()}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 pt-0">
                <button
                  onClick={() => setSelectedPlan(subscription.title)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    selectedPlan === subscription.title
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {selectedPlan === subscription.title ? 'Đã chọn' : 'Chọn gói này'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Điều khoản và điều kiện</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {terms.map((term, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{term}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-3 text-gray-700 font-medium">
              Tôi đồng ý với các điều khoản và điều kiện
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            disabled={!acceptedTerms}
            className={`px-10 py-4 rounded-xl font-medium text-lg transition flex items-center mx-auto ${
              !acceptedTerms
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }`}
          >
            Tiếp tục đăng ký ({selectedPlan})
            {acceptedTerms && <ChevronRight className="ml-2 h-5 w-5" />}
          </button>
          <p className="mt-4 text-gray-500 text-sm">
            Bạn sẽ được hướng dẫn các bước tiếp theo sau khi đăng ký thành công
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreRegistration;