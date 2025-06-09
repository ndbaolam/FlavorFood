import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, Store, Package, ShieldCheck, Star } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { Subscription } from './store.interface';
import { toast } from 'react-toastify';
import ThankYou from './ThankyouPopup';

const StoreRegistration = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
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

        const sortedSubscriptions = processedSubscriptions.sort(
          (a: Subscription, b: Subscription) =>
            parseFloat(a.price) - parseFloat(b.price)
        );

        setSubscriptions(sortedSubscriptions);
        if (sortedSubscriptions.length > 0) {
          setSelectedPlanId(sortedSubscriptions[0]?.subscription_id);

        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách gói:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'success') {
      toast.success('Thanh toán thành công!', { toastId: 'success' });
      setShowThankYouPopup(true);
    } else if (status === 'fail') {
      toast.error('Thanh toán thất bại!', { toastId: 'fail' });
    }
  }, []);
  
  const closeThankYouPopup = () => {
    setShowThankYouPopup(false);
  };
  const parseFeatures = (descriptionStr: string): string[] => {
    if (!descriptionStr) return [];
    return descriptionStr.split('\n').map(item => item.trim()).filter(item => item.length > 0);
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

  const timestamp = Date.now();
  const orderId = `order_${selectedPlanId}_${timestamp}`;

  const handleSubmit = async () => {
    if (!acceptedTerms || !selectedPlanId) return;

    const selectedPlan = subscriptions.find(sub => sub.subscription_id === selectedPlanId);
    if (!selectedPlan) return;
    const price = selectedPlan.price;
    try {
      const response = await axiosInstance.get('/payment/momo', {
        withCredentials: true,
        params: {
          orderId,
          amount: price
        }
      });
      if (response.data?.payUrl) {
        setQrCodeUrl(response.data.payUrl);
        window.location.href = response.data.payUrl;

      } else {
        console.error('Không nhận được mã QR từ server');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API thanh toán:', error);
    }
  };

  return (
    <>
      {showThankYouPopup ? (
        <ThankYou onClose={closeThankYouPopup} hasStore={true} />
      ) : (
        <div className="min-h-screen flex justify-center items-center px-4">
          <div className="w-full max-w-7xl border border-gray-300 shadow-lg bg-white rounded-xl p-12 mt-10">
            <div className="text-center mb-16 container">
              <h1 className="text-4xl font-extrabold text-black mb-4">Đăng ký cửa hàng</h1>
              <p className="text-xl text-black max-w-2xl mx-auto">Nâng tầm kinh doanh của bạn với nền tảng quản lý hiện đại và thông minh</p>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
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
                <span className="px-4 bg-gray-50 text-lg font-medium text-black">Chọn gói phù hợp</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.subscription_id}
                  className={`relative rounded-2xl transition-all duration-300 border-2 flex flex-col ${selectedPlanId === subscription.subscription_id
                    ? 'border-indigo-500 transform scale-105 shadow-xl'
                    : 'bg-white border-gray-200 transform scale-100 shadow-md'
                    } overflow-hidden`}
                >
                  {subscription.isHighlight && (
                    <div className="absolute top-0 inset-x-0 py-2 bg-indigo-600 text-white text-center text-sm font-semibold">
                      <span className="inline-flex items-center justify-center space-x-2 text-sm font-semibold text-white">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Được lựa chọn nhiều nhất</span>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </span>
                    </div>
                  )}

                  <div className={`${subscription.isHighlight ? 'pt-4' : ''}`}>
                    <div className="text-center p-6 border-b-4 border-gray-200 bg-gradient-to-b from-white to-gray-50 min-h-[48px]">
                      <h3 className="text-3xl font-bold text-black mb-3">{subscription.title}</h3>
                      <div className="flex flex-col items-center justify-center mb-3">
                        <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                          {formatPrice(subscription.price)} đ
                        </span>
                      </div>
                      <div className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-medium bg-green-100 text-green-800">
                        {calculateSavings(subscription)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col h-full">
                      <p className="text-lg font-medium text-black mb-4 text-center border-b border-gray-200 pb-3">
                        Bao gồm các dịch vụ
                      </p>
                      <div className="flex-grow">
                        <ul className="space-y-4 mb-8">
                          {(() => {
                            const features = parseFeatures(subscription.description);
                            return Array.isArray(features) ? features.map((feature: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-black">{feature}</span>
                              </li>
                            )) : (
                              <li className="text-black">Không có thông tin chi tiết</li>
                            );
                          })()}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-6 pt-0">
                    <button
                      onClick={() => setSelectedPlanId(subscription.subscription_id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition ${selectedPlanId === subscription.subscription_id
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      {selectedPlanId === subscription.subscription_id ? 'Đã chọn' : 'Chọn gói này'}
                    </button>

                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">Điều khoản và điều kiện</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {terms.map((term, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-black">{term}</span>
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
                <label htmlFor="terms" className="ml-3 text-black font-medium">
                  Tôi đồng ý với các điều khoản và điều kiện
                </label>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!acceptedTerms}
                className={`px-10 py-4 rounded-xl font-medium text-lg transition flex items-center mx-auto ${!acceptedTerms
                  ? 'bg-gray-300 text-black cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                Đăng ký
                {acceptedTerms && <ChevronRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreRegistration;