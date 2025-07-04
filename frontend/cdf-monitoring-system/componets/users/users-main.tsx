
import SideNav from "../side-nav";
import UserTable from "./users-table";

const UserPage = () => {

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar: 1/3 width */}
        <SideNav>

        </SideNav>
      {/* Main content: 2/3 width */}
      <main className="w-2/3 p-12 overflow-y-auto flex flex-col">
        {/* Top cards grid */}
        <UserTable />
      </main>
    </div>
  );
};

export default  UserPage