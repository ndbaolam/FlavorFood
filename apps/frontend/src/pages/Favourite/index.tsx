import React from "react";
import UserSidebar from "../../components/UserSidebar";
import FavoriteList from "../../components/FavoriteList"; 

const Favourite: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <UserSidebar />
      <main className="container mx-auto px-4">
        <FavoriteList />
      </main>
    </div>
  );
};

export default Favourite;
