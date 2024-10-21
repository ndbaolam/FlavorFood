import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.css';
import AppRoutes from './routes/AppRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={AppRoutes} />
  </StrictMode>,
)
