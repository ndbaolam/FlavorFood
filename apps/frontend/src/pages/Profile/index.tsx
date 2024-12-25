import React from "react";

interface User {
    user_id: number;
    mail: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
    role: 'Norm' | 'Admin' | 'Seller';
}

const users: User[] = [
    {
        user_id: 1,
        mail: 'nguoithuong@example.com',
        password: 'matkhau123',
        first_name: 'Nguyễn',
        last_name: 'Văn A',
        avatar: 'https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg',
        role: 'Norm'
    },

];

const Profile: React.FC = () => {
    return (
        <div className="min-h-screen max-w-screen">
            <main className="container mx-auto px-4">
                <h1 className="my-12 text-4xl">Thông tin tài khoản</h1>
                {users.map((user) => (
                    <div key={user.user_id} className="mb-8">
                        <div>
                            <h2 className="text-2xl mb-4">Ảnh đại diện</h2>
                            <div className="flex items-center gap-10">
                                <div className="recipe-card">
                                    <img
                                        src={user.avatar}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>

                                <a
                                    href="#"
                                    className="px-4 py-2 font-semibold text-lg transform transition-transform duration-300 hover:scale-105 border-2 border-blue-500 rounded-lg">
                                    Tải ảnh lên
                                </a>

                                <a
                                    href="#"
                                    className="px-4 py-2 font-semibold text-lg transform transition-transform duration-300 hover:scale-105 border-2 border-gray-500 rounded-lg">
                                    Xoá ảnh
                                </a>
                            </div>

                            <hr className="my-10 border-t-2 border-gray-300" />

                            <div className="mt-10 flex items-center gap-20">
                                <div>
                                    <h2 className="text-2xl mb-4">Họ</h2>
                                    <div className="flex items-center gap-4 border-2 border-gray-500 rounded-lg px-4 py-2 w-60">
                                        <span className="text-lg">{user.first_name}</span>
                                    </div>

                                </div>

                                <div>
                                    <h2 className="text-2xl mb-4">Tên</h2>
                                    <div className="flex items-center gap-4 border-2 border-gray-500 rounded-lg px-4 py-2 w-60">
                                        <span className="text-lg">{user.last_name}</span>
                                    </div>

                                </div>
                            </div>
                            <hr className="my-10 border-t-2 border-gray-300" />

                            <div className="mt-10 items-center gap-20">
                                <div>
                                    <h2 className="text-2xl mb-4">Địa chi email</h2>
                                    <div className="flex items-center gap-4 border-2 border-gray-500 rounded-lg px-4 py-2 w-64">
                                        <span className="text-lg">{user.mail}</span>
                                    </div>

                                </div>
                            </div>
                            <hr className="my-10 border-t-2 border-gray-300" />
                              <div>
                                
                                </div>

                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};



export default Profile;
