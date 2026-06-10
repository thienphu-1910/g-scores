import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-200">
      <Header />
      <main className="flex-1 w-full px-2 py-2">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout