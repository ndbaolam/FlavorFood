import { useEffect, useState } from "react";
import { Store } from "../../Market/store.interface";
import axiosInstance from '../../../services/axiosInstance';
import SearchBox from "../../../components/Search";

const LIMIT = 3;

const AdminStore = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [selectedStores, setSelectedStores] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axiosInstance.get<Store[]>("/stores", {
                    withCredentials: true,
                });
                setStores(response.data);
                setFilteredStores(response.data);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };
        fetchStores();
    }, []);

    useEffect(() => {
        const searched = stores.filter((store) =>
            store.name?.toLowerCase().includes(searchTitle.toLowerCase())
        );
        setFilteredStores(searched);
        setCurrentPage(1);
    }, [searchTitle, stores]);

    const toggleSelect = (id: number) => {
        setSelectedStores((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const sortedStores = [...filteredStores].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const totalPages = Math.ceil(sortedStores.length / LIMIT);
    const paginatedStores = sortedStores.slice(
        (currentPage - 1) * LIMIT,
        currentPage * LIMIT
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const renderPageButton = (pageNum: number) => (
            <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded ${currentPage === pageNum
                    ? "bg-blue-500 text-white font-medium"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                    }`}
            >
                {pageNum}
            </button>
        );

        const paginationItems = [];

        paginationItems.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded mr-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
            >
                &lt;
            </button>
        );

        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(renderPageButton(i));
        }

        paginationItems.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded ml-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
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
        <div className="m-12 border border-white rounded-xl shadow-lg bg-white">
            <div className="mt-4 flex items-center justify-end p-4">
                <div>
                    <SearchBox onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
                </div>

            </div>
            <div className="flex justify-between p-4 text-md">
                <div>
                    Tổng số cửa hàng: {filteredStores.length}
                </div>
                <div>
                    Trang {currentPage} / {totalPages}
                </div>
            </div>
            <div className="overflow-x-auto px-4 pb-4">
                <table className="min-w-full bg-white shadow-md rounded-lg border">
                    <thead>
                        <tr className="bg-blue-700 text-white text-left">
                            <th className="p-3">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelectedStores(
                                            e.target.checked
                                                ? paginatedStores.map((a) => a.store_id)
                                                : []
                                        )
                                    }
                                    checked={
                                        selectedStores.length === paginatedStores.length &&
                                        paginatedStores.length > 0
                                    }
                                />
                            </th>
                            <th className="p-3">Tên cửa hàng</th>
                            <th className="p-3">Số điện thoại</th>
                            <th className="p-3">Chủ sở hữu</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Địa chỉ</th>
                            <th className="p-3">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStores.length > 0 ? (
                            paginatedStores.map((store) => (
                                <tr key={store.store_id} className="border-b hover:bg-gray-100">
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedStores.includes(store.store_id)}
                                            onChange={() => toggleSelect(store.store_id)}
                                        />
                                    </td>
                                    <td className="p-3">{store.name}</td>
                                    <td className="p-3">{store.phone_number}</td>
                                    <td className="p-3">{store.user.first_name} {store.user.last_name}</td>
                                    <td className="p-3">{store.user.mail}</td>
                                    <td className="p-3">{store.address}</td>
                                    <td className="p-3">{new Date(store.created_at).toLocaleDateString()}</td>
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
