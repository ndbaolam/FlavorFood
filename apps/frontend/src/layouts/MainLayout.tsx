// MainLayout.tsx
import { Outlet } from "react-router-dom";
import { FC } from "react";
import Navbar from "../components/NavBar";
import Footer  from "../components/Footer";

const MainLayout: FC = () => {
  return (
    <div className="bg-white">
      <Navbar setActivePage={(page: string) => console.log(`Active page set to: ${page}`)} />
      <main >
        <Outlet /> {}
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;