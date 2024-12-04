// MainLayout.tsx
import { Outlet } from "react-router-dom";
import { FC } from "react";
import Navbar from "../components/NavBar";
import Footer  from "../components/Footer";

const MainLayout: FC = () => {
  return (
    <div className="bg-white">
      <Navbar/>
      <main >
        <Outlet /> {}
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;