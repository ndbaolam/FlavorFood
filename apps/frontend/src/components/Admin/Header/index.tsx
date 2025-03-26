import { Search, Bell } from "lucide-react";


const AdminHeader = ({ activePage }: { activePage: string }) => {
  return (
    <header className="bg-gray-50 shadow p-4 flex justify-between items-center">
      <h2 className=" ml-4 text-3xl font-bold">{activePage}</h2>
      <div className="flex items-center space-x-4">
        <button className="">
          <Bell />
        </button>
       
        <div className="w-8 h-8 bg-gray-300 rounded-full">

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
