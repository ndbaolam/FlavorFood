import { Outlet } from "react-router-dom";
import { FC, useState } from "react";
import AdminHeader from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/Sidebar";

const AdminLayout: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          setActivePage={() => { }}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
