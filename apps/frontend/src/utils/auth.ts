import { User } from '../pages/Profile/Profile.interface';
import axiosInstance from '../services/axiosInstance';

/**
 * Kiểm tra trạng thái đăng nhập
 * @returns true nếu đã đăng nhập, false nếu chưa hoặc lỗi
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    await axiosInstance.get('/auth/profile');
    return true;
  } catch {
    return false;
  }
};

/**
 * Lấy thông tin user profile
 * @returns User nếu thành công, null nếu chưa đăng nhập hoặc lỗi
 */
export const getUserProfile = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get<User>('/auth/profile');
    return res.data;
  } catch {
    return null;
  }
};
