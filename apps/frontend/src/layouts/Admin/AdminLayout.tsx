// AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { FC, useState } from "react";
import AdminFooter from "../../components/Admin/Footer";
import AdminHeader from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/Sidebar";

const AdminLayout: FC = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div >
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <AdminHeader activePage={activePage} />
        <main>
        <Outlet /> {}
        </main>
      </div>
    </div>
     <AdminFooter />
     </div>
  );
};

export default AdminLayout;