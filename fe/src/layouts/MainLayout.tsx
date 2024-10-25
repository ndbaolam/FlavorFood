// MainLayout.tsx
import { Outlet } from "react-router-dom";
import { FC } from "react";

const MainLayout: FC = () => {
  return (
    <div>
      <header>Header Content</header>
      <main>
        <Outlet /> {/* Nested routes will render here */}
      </main>
      <footer>Footer Content</footer>
    </div>
  );
};

export default MainLayout;