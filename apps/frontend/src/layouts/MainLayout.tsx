// MainLayout.tsx
import { Outlet } from "react-router-dom";
import { FC } from "react";
import Navbar from "../components/NavBar";
import Footer  from "../components/Footer";

const MainLayout: FC = () => {
  return (
    <div>
      <Navbar/>
      <main>
        <Outlet /> {/* Nested routes will render here */}
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;