import React from "react";

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
}

const users: User[] = [
  {
    user_id: 1,
    mail: "mi@xpaytech.co",
    password: "matkhau123",
    first_name: "Đinh",
    last_name: "Ánh",
    avatar:
      "https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg",
    role: "Norm",
    phone: "+20-01274318900",
    address: "285 N Broad St, Elizabeth, NJ 07208, USA",
  },
];

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="container mx-auto px-4">
        <h1 className="my-12 text-4xl text-center font-semibold">
          Thông tin tài khoản
        </h1>
        {users.map((user) => (
          <div
            key={user.user_id}
            className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto p-6 flex"
          >
          
            <div className="w-1/3 flex flex-col items-center">
            
              <div className="relative w-40 h-40 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.first_name}
                  className="w-full h-full object-cover"
                />
            
              </div>

              
              <div className="mt-4 flex space-x-3">
               
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center w-36 h-20 flex items-center justify-center text-purple-500 cursor-pointer">
                  📤 <br />
                Thư viện
                </div>
              </div>
            </div>

           
            <div className="w-2/3 px-10 flex flex-col justify-center">
            <p className="text-gray-600 mt-2">
                <strong>Họ tên: </strong>{user.first_name} {user.last_name}</p>
              <p className="text-gray-600 mt-2">
                <strong>Email:</strong> {user.mail}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Số điện thoại:</strong> {user.phone}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Địa chỉ:</strong> {user.address}
              </p>
            
              <button className="mt-4 px-6 py-2 border border-purple-400 text-purple-600 rounded-lg hover:bg-purple-100">
                 Thay đổi thông tin
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Profile;
