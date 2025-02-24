import React from "react";
import UserSidebar from "../../components/UserSidebar";
import FavoriteList from "../../components/FavoriteList"; 

const Favourite: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <UserSidebar />
      <main className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mt-10 mb-6 text-center">Danh sách yêu thích</h2>
        <FavoriteList />
      </main>
    </div>
  );
};

export default Favourite;
