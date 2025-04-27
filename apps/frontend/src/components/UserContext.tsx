import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

// Khai báo kiểu cho children
interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
