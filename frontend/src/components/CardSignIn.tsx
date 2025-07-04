import { ReactNode, useEffect, useState } from 'react';
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CodeResponse,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google';
import axiosInstance from '../services/axiosInstance';
import { User } from '../pages/Profile/Profile.interface';
import { toast } from 'react-toastify';
import { Console } from 'console';

interface CardProps {
  children?: ReactNode;
}

const CardSignIn: React.FC<CardProps> = ({ children }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axiosInstance.post(
        '/auth/login',
        { mail, password },
        { withCredentials: true }
      );

      const accessToken = response.data.access_token;
      if (accessToken) {
        // localStorage.setItem('authToken', accessToken);
        window.dispatchEvent(new CustomEvent('userLoggedIn'));

        const returnTo = (location.state as any)?.returnTo;
        navigate(returnTo || '/');
      } else {
        toast.error('Không nhận được token từ máy chủ.');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };



  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse | TokenResponse) => {
      const { access_token } = codeResponse as TokenResponse;

      try {
        const response = await axiosInstance.post(
          '/auth/google/verify',
          { access_token },
        );


        // localStorage.setItem('authToken', response.data.token);
        window.dispatchEvent(new CustomEvent('userLoggedIn'));

        const returnTo = (location.state as any)?.returnTo;
        navigate(returnTo || '/');
      } catch (error) {
        console.error('Đăng nhập với Google thất bại:', error);
        toast.error('Đăng nhập với Google thất bại. Vui lòng thử lại.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Đăng nhập với Google thất bại.');
    },
  });

  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden w-fit max-w-2xl z-20 flex">
        <div className="hidden sm:block">
          <img
            src="https://www.elle.vn/wp-content/uploads/2017/09/21/JW-Marriott-Hanoi4.jpg"
            alt="signin"
            className="rounded-l-lg h-full"
          />
        </div>
        <div className="p-8 bg-white">
          {children}
          <h2 className="text-2xl font-bold text-center mb-6">ĐĂNG NHẬP</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Mail đăng nhập"
                className="border rounded-lg px-4 py-2 w-full"
                required
                value={mail}
                onChange={handleMailChange}
              />
            </div>
            <div className="relative mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className="border rounded-lg px-4 py-2 w-full"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-black"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 3.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-eye-slash"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                  >
                    <path d="M8 3.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM2.3 8c-.1-.3-.3-.6-.5-.9L1 7.9C1.7 9.1 3 10.4 4.5 11.1l1.1-1.1C3.6 10 2.6 9.2 2.3 8zM8 4a4 4 0 0 0-3.8 5.2l1.1-1.1C6.8 7.6 7.3 7 8 7c1.1 0 2.1.7 2.4 1.7l1.1-1.1A4.007 4.007 0 0 0 8 4zM14 8c.1.3.3.6.5.9l1.2-.1C14.3 6.9 12 5.6 10.5 4.9l-1.1 1.1c1 1 1.7 2.4 1.7 3.8zm-1.6 3.5c.4-.4.7-1 .9-1.5l1.2-.1C14.3 11.1 12 12.4 10.5 13.1l-1.1-1.1c1-1 1.7-2.4 1.7-3.8zM7.9 14.4l1.1-1.1c-.5-.5-1.1-.9-1.7-1.2l-1.1 1.1c1 .1 2.1.1 3.1-.1z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="bg-black text-white rounded-lg px-4 py-2 w-full"
            >
              ĐĂNG NHẬP
            </button>
          </form>
          <div className="mt-10 grid grid-cols-3 items-center text-black">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">HOẶC</p>
            <hr className="border-gray-400" />
          </div>

          <button
            className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm"
            onClick={() => {
              googleLogin();
            }}
          >
            <img
              className="w-6 h-6 mr-2"
              src="./google.png"
              alt="Google logo"
            />
            Đăng nhập với Google
          </button>
          <p className="text-center text-black mt-4">
            Bạn chưa có tài khoản?{' '}
            <Link className="text-blue-500 hover:underline" to="/sign-up">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
      <div className="absolute inset-0 w-screen h-screen overflow-hidden">
        <img
          src="./bg.jpg"
          className="object-cover w-full h-full blur-sm"
          alt="Background"
        />
      </div>
    </div>
  );
};

export default CardSignIn;

