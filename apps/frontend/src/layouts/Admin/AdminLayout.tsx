// AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { FC } from "react";
import AdminFooter from "../../components/Admin/Footer";
import AdminHeader from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/Sidebar";

const AdminLayout: FC = () => {
  return (
    <>
      <AdminHeader/>
      <main >
        <AdminSidebar />
        <Outlet /> {}
      </main>
      <AdminFooter/>
    </>
  );
};

export default AdminLayout;