import React, { useEffect, useState } from "react";
import { faUser, faBan } from "@fortawesome/free-solid-svg-icons";
import { FaUserAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from '../services/axiosInstance';

interface User {
    user_id: number;
    mail: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
    role: "Norm" | "Admin" | "Seller";
    phone: string;
    address: string;
    username?: string; // Thêm username (nếu API có)
}

export default function UserSidebar() {
    const [formData, setFormData] = useState<User | null>(null);
    const [activeLink, setActiveLink] = useState<string>("profile"); 
    const { t } = useTranslation();

    // Lấy dữ liệu từ API khi component được render
    useEffect(() => {
        axiosInstance
            .get("/auth/profile") // Không cần baseURL vì axiosInstance đã có sẵn
            .then((response) => {
                setFormData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    return (
        <div className="bg-[var(--color-secondary)] w-[250px] h-[535px] rounded-[10px] pl-[25px] pb-[25px] flex flex-col gap-[20px]">
            {/* Hiển thị Avatar và Username */}
            <div className="w-full flex flex-row items-center gap-[10px]" style={{ marginTop: "15px", paddingLeft: "10px" }}>
                <FaUserAlt />
                <h2 className="text-3xl font-bold">@{formData?.username || "User"}</h2>
            </div>

            {/* Điều hướng */}
            <div className="flex-1 overflow-y-auto">
                {/* Link đến Profile */}
                <Link
                    className={`link ${activeLink === "profile" ? "font-bold bg-[var(--color-secondary-dark)]" : ""}`}
                    to="/profile"
                    style={{ color: "unset", textDecoration: "none", paddingLeft: "20px" }}
                    onClick={() => setActiveLink("profile")}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px" }}>
                        <FontAwesomeIcon icon={faUser} />
                        <span className="title">{t("header.profile")}</span>
                    </div>
                </Link>

                {/* Link đến Danh sách yêu thích */}
                <Link
                    className={`link ${activeLink === "favourite" ? "font-bold bg-[var(--color-secondary-dark)]" : ""}`}
                    to="/favourite"
                    style={{ color: "unset", textDecoration: "none", paddingLeft: "20px" }}
                    onClick={() => setActiveLink("favourite")}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px" }}>
                        <FontAwesomeIcon icon={faBan} />
                        <span className="title">{t("favourite")}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
