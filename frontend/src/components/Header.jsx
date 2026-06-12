import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navbarOptions = [
    {
      title: "Dashboard",
      to: "/dashboard",
    },
    {
      title: "Search",
      to: "/search-scores",
    },
    {
      title: "Reports",
      to: "/reports",
    },
  ];

  const [isShowSidebar, setShowSidebar] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="w-full h-fit bg-blue-950 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="w-full flex flex-row justify-between md:justify-start md:gap-5 items-center">
          <Link to="/dashboard" className="text-2xl text-white font-bold">G-Scores</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-row gap-7 justify-center items-end">
            {navbarOptions.map((option) => (
              <NavLink
                key={option.title}
                to={option.to}
                className={({ isActive }) =>
                  `text-sm relative group duration-300 ${
                    isActive
                      ? "text-white active-link pb-1"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {option.title}
                <span className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 w-0 group-[.active-link]:w-full" />
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="flex md:hidden p-1 rounded-md hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            onClick={() => setShowSidebar(true)}
            aria-label="Open menu"
          >
            <Menu color="#ffffff" size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay (Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isShowSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowSidebar(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-blue-950 z-50 shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isShowSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            aria-label="Close menu"
          >
            <X color="#ffffff" size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-2 p-4 mt-2">
          {navbarOptions.map((option) => (
            <NavLink
              key={option.title}
              to={option.to}
              onClick={() => setShowSidebar(false)} // Auto-close sidebar on route change
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-900 text-white font-medium shadow-inner"
                    : "text-white/70 hover:bg-blue-900/50 hover:text-white"
                }`
              }
            >
              {option.title}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Header;
