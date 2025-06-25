import { JSX, useEffect, useMemo, useState } from "react";
import { Store } from "../../Market/store.interface";
import axiosInstance from '../../../services/axiosInstance';
import SearchBox from "../../../components/Search";
import { flexibleSearch } from "../../../utils/vietnameseUtils"
import { formatDate } from '../../../utils/fomatDate';
import React from "react";
const LIMIT = 5;

const AdminStore = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [searchTitle, setSearchTitle] = useState(() => localStorage.getItem("store_searchTitle") || "");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(() => localStorage.getItem("store_selectedStatus") || "");

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axiosInstance.get<Store[]>("/stores", {
                    withCredentials: true,
                });
                setStores(response.data);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };
        fetchStores();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTitle, selectedStatus]);

    useEffect(() => {
        localStorage.setItem("store_searchTitle", searchTitle);
    }, [searchTitle]);
    useEffect(() => {
        localStorage.setItem("store_selectedStatus", selectedStatus);
    }, [selectedStatus]);


    const sortedStores = useMemo(() => {
        return [...stores].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            if (dateB !== dateA) {
                return dateB - dateA;
            }
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }, [stores]);

    const filteredStore = useMemo(() => {
        return sortedStores.filter((store) => {
            const ownerFullName = `${store.user?.first_name || ""} ${store.user?.last_name || ""}`;

            const matchSearch = flexibleSearch([
                store.name || '',
                store.address || '',
                ownerFullName
            ], searchTitle);

            const matchStatus = selectedStatus === "" || store.status === selectedStatus;

            return matchSearch && matchStatus;
        });
    }, [searchTitle, selectedStatus, sortedStores]);


    const totalPages = Math.ceil(filteredStore.length / LIMIT);

    const paginatedStores = useMemo(() => {
        const start = (currentPage - 1) * LIMIT;
        return filteredStore.slice(start, start + LIMIT);
    }, [filteredStore, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const renderPageButton = (pageNum: number, label?: string) => (
            <button
                key={label || pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded ${currentPage === pageNum
                    ? "bg-blue-500 text-white font-medium"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                    }`}
            >
                {label || pageNum}
            </button>
        );

        const paginationItems: JSX.Element[] = [];

    paginationItems.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded mr-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
        aria-label="Trang trước"
      >
        &lt;
      </button>
    );

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                paginationItems.push(renderPageButton(i));
            }
        } else {
            paginationItems.push(renderPageButton(1));

            if (currentPage > 2) {
                paginationItems.push(<span key="ellipsis1" className="px-2">...</span>);
            } else if (currentPage === 2) {
                paginationItems.push(renderPageButton(2));
            }

            if (currentPage > 2) {
                paginationItems.push(renderPageButton(currentPage));
            }

            if (currentPage < totalPages - 1) {
                paginationItems.push(renderPageButton(currentPage + 1));
            }

            if (currentPage < totalPages - 2) {
                paginationItems.push(<span key="ellipsis2" className="px-2">...</span>);
            } else if (currentPage === totalPages - 2) {
                paginationItems.push(renderPageButton(totalPages - 1));
            }

            if (currentPage < totalPages) {
                paginationItems.push(renderPageButton(totalPages));
            }
        }

        paginationItems.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded ml-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
                aria-label="Trang sau"
            >
                &gt;
            </button>
        );

        return (
            <div className="flex justify-end items-center space-x-1 mt-6">
                {paginationItems}
            </div>
        );
    };


    return (
        <div>
            <div className="text-4xl font-bold ml-3">
                Quản lý cửa hàng
            </div>
            <div className="flex flex-wrap items-end justify-end gap-4 px-4 pt-4">
                <SearchBox placeholder="Tìm kiếm cửa hàng/địa chỉ" onSearch={setSearchTitle} isPopupOpen={isPopupOpen} value={searchTitle} />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                </select>
            </div>

            <div className="flex justify-between p-4 text-md">
                <div>Tổng số cửa hàng: {filteredStore.length}</div>
                <div>Trang {currentPage} / {totalPages}</div>
            </div>

            <div className="overflow-x-auto ml-4 mr-4 mb-4">
                <table className="min-w-full bg-white shadow-md border border-black">
                    <thead>
                        <tr className="bg-blue-700 text-white border-b  border-black">
                            <th className="p-3 text-center border-r border-white">Tên cửa hàng</th>
                            <th className="p-3 text-center border-r border-white">Số điện thoại</th>
                            <th className="p-3 text-center border-r border-white">Chủ cửa hàng</th>
                            <th className="p-3 text-center border-r border-white">Email</th>
                            <th className="p-3 text-center border-r border-white">Địa chỉ</th>
                            <th className="p-3 text-center border-r border-white">Ngày tạo</th>
                            <th className="p-3 text-center w-36">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStores.length > 0 ? (
                            paginatedStores.map((store) => (
                                <tr key={store.store_id} className="border-b hover:bg-gray-100 ">
                                    <td className="p-3 border-l border-black border-b">{store.name}</td>
                                    <td className="p-3 text-center border-l border-black border-b">{store.phone_number}</td>
                                    <td className="p-3 border-l border-black border-b">{store.user.first_name} {store.user.last_name}</td>
                                    <td className="p-3 border-l border-black border-b">{store.user.mail}</td>
                                    <td className="p-3 border-l border-black border-b">{store.address}</td>
                                    <td className="p-3 text-center border-l border-black border-b">{formatDate(store.created_at)}</td>
                                    <td className="p-3 text-center border-l border-black border-b w-40">
                                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${store.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {store.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 p-4">
                                    Không tìm thấy cửa hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {renderPagination()}
            </div>
        </div>
    );
};

export default AdminStore;