import { useEffect, useState } from "react";
import { Store } from "../../Market/store.interface";
import axiosInstance from '../../../services/axiosInstance';
import SearchBox from "../../../components/Search";

const LIMIT = 5;

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
        <div>
            <div className="text-4xl font-bold ml-3">
                Quản lý cửa hàng
            </div>
            <div className="mt-12 flex items-center justify-between px-4 text-md  mb-4">
                <div>
                    Tổng số cửa hàng: {filteredStores.length}
                </div>
                <div className="flex items-center gap-x-4">
                    <SearchBox onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
                    <span>Trang {currentPage} / {totalPages}</span>
                </div>
            </div>

            <div className="overflow-x-auto ml-4 mr-4 mb-4">
                <table className="min-w-full bg-white shadow-md border border-black">
                    <thead>
                        <tr className="bg-blue-700 text-white border-b  border-black">
                            <th className="p-3 border-r border-white ">
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
                            <th className="p-3 text-center border-r border-white">Tên cửa hàng</th>
                            <th className="p-3 text-center border-r border-white">Số điện thoại</th>
                            <th className="p-3 text-center border-r border-white">Chủ cửa hàng</th>
                            <th className="p-3 text-center border-r border-white">Email</th>
                            <th className="p-3 text-center border-r border-white">Địa chỉ</th>
                            <th className="p-3 text-center border-r border-white">Trạng thái</th>
                            <th className="p-3 text-center">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStores.length > 0 ? (
                            paginatedStores.map((store) => (
                                <tr key={store.store_id} className="border-b hover:bg-gray-100 ">
                                    <td className="p-3 text-center border-black border-b">
                                        <input
                                            type="checkbox"
                                            checked={selectedStores.includes(store.store_id)}
                                            onChange={() => toggleSelect(store.store_id)}
                                        />
                                    </td>
                                    <td className="p-3 text-center border-l border-black border-b">{store.name}</td>
                                    <td className="p-3 text-center border-l border-black border-b">{store.phone_number}</td>
                                    <td className="p-3 border-l border-black border-b">{store.user.first_name} {store.user.last_name}</td>
                                    <td className="p-3 border-l border-black border-b">{store.user.mail}</td>
                                    <td className="p-3 border-l border-black border-b">{store.address}</td>
                                    <td className="p-3 text-center border-l border-black border-b">
                                        <span className={`px-2 py-1 rounded-full text-xs ${store.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center border-l border-black border-b">{new Date(store.created_at).toLocaleDateString()}</td>

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
