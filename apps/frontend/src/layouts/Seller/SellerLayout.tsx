// SellerLayout.tsx
import { Outlet } from "react-router-dom";
import { FC, useState } from "react";
import SellerHeader from "../../components/Seller/Header";
import SellerFooter from "../../components/Seller/Footer";


const SellerLayout: FC = () => {
 

  return (
    <div >
    <div className="flex h-screen bg-gray-100">

      <div className="flex-1 flex flex-col">
        <SellerHeader />
        <main>
        <Outlet /> {}
        </main>
      </div>
    </div>
     <SellerFooter />
     </div>
  );
};

export default SellerLayout;