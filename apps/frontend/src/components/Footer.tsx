// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 text-base-content p-10 mt-20 ">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* Services Section */}
        <nav>
          <h6 className="footer-title">Dịch vụ</h6>
          <div className="link link-hover">Công thức nấu ăn</div>
          <div className="link link-hover">Chợ</div>
          <div className="link link-hover">Mẹo vặt bếp</div>
        </nav>

        {/* About Us Section */}
        <nav>
          <h6 className="footer-title">Về chúng tôi</h6>
          <div className="link link-hover">Giới thiệu</div>
          <div className="link link-hover">Liên hệ</div>
       
        </nav>

        {/* Legal Section */}
        <nav>
          <h6 className="footer-title">Pháp lý</h6>
          <div className="link link-hover">Điều khoản sử dụng</div>
          <div className="link link-hover">Chính sách bảo mật</div>
          <div className="link link-hover">Chính sách cookie</div>
        </nav>
      </div>

      <div className="border-t border-base-300 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>
            Flavor Food Ltd.
            <br />
            Cung cấp công thức nấu ăn ngon từ 2024
          </p>
          <div className="flex space-x-4">
            {/* Social Media Icons */}
            <a href="#" className="text-gray-700 hover:text-gray-900" aria-label="Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM8 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm1.5-10H7v-1c0-.6.4-1 1-1h1V2.5h-1c-1.1 0-2 .9-2 2v1h-1v2h1v6h2V7h1.5l.5-2z" />
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900" aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8A8 8 0 0 0 8 0zm3.2 4.2a.8.8 0 0 1 .8.8v1.6a.8.8 0 0 1-.8.8H9.6a.8.8 0 0 1-.8-.8V5a.8.8 0 0 1 .8-.8h1.6zm-3.2 7.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z" />
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900" aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-twitter"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.034 0 9.317-5 9.317-9.317 0-.141 0-.283-.01-.424A6.686 6.686 0 0 0 16 3.262a6.733 6.733 0 0 1-1.889.517 3.32 3.32 0 0 0 1.451-1.83 6.69 6.69 0 0 1-2.116.807 3.296 3.296 0 0 0-5.616 2.998A9.34 9.34 0 0 1 1.112 2.838 3.293 3.293 0 0 0 2.15 7.007 3.302 3.302 0 0 1 .64 6.597v.034a3.295 3.295 0 0 0 2.639 3.23 3.314 3.314 0 0 1-.865.116 3.23 3.23 0 0 1-.617-.057 3.305 3.305 0 0 0 3.072 2.285 6.593 6.593 0 0 1-4.856 1.363 9.26 9.26 0 0 0 5.032 1.477" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
