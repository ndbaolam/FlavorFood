import axiosInstance from '../services/axiosInstance';

export const checkAuth = async (): Promise<boolean> => {
  try {
    await axiosInstance.get('/auth/profile');
    return true;
  } catch {
    return false;
  }
};