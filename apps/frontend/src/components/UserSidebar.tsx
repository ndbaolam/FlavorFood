import React, { useEffect, useState } from "react";
import { faUser, faHeart, faNewspaper } from "@fortawesome/free-solid-svg-icons"; // Correct import for faHeart
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../services/axiosInstance";

interface User {
  user_id: number;
  mail: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: "Norm" | "Admin" | "Seller";
}

export default function UserSidebar() {
  const [formData, setFormData] = useState<User | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    axiosInstance
      .get("/auth/profile")
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="bg-gray-300 w-[300px]   flex flex-col gap-4">
      <div className="flex-1 overflow-y-auto pt-14">
        {/* Profile Link */}
        <Link
          to="/profile"
          className={`flex items-center gap-3 py-2 px-5 rounded-md transition-all ${
            location.pathname === "/profile"
              ? "font-bold bg-[var(--color-secondary-dark)]"
              : "hover:bg-gray-200"
          }`}
        >
          <FontAwesomeIcon icon={faUser} />
          <span>{t("Thông tin cá nhân")}</span>
        </Link>

        {/* Favourite List Link */}
        <Link
          to="/favourite"
          className={`flex items-center gap-3 py-2 px-5 rounded-md transition-all ${
            location.pathname === "/favourite"
              ? "font-bold bg-[var(--color-secondary-dark)]"
              : "hover:bg-gray-200"
          }`}
        >
          <FontAwesomeIcon icon={faHeart} /> {/* Corrected FontAwesomeIcon usage */}
          <span>{t("Yêu thích")}</span>
        </Link>

         {/* Posts Section */}
         <Link
          to="/post"
          className={`flex items-center gap-3 py-2 px-5 rounded-md transition-all ${
            location.pathname === "/posts"
              ? "font-bold bg-[var(--color-secondary-dark)]"
              : "hover:bg-gray-200"
          }`}
        >
          <FontAwesomeIcon icon={faNewspaper} />
          <span>{t("Bài viết")}</span>
        </Link>

      </div>
    </div>
  );
}
