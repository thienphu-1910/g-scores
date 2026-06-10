import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

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
      <header className="w-full h-fit bg-blue-950 px-3 py-2">
        <div className="w-full flex flex-row gap-10 justify-between md:justify-start items-center">
          <h2 className="text-2xl text-white font-bold">G-Scores</h2>
          <div className="hidden md:flex flex-row gap-7 justify-center items-end">
            {navbarOptions.map((option) => (
              <NavLink
                to={option.to}
                className={({ isActive }) =>
                  `text-sm relative group duration-300  ${
                    isActive
                      ? "text-white active-link pb-1"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {option.title}
                <span className="absolute bottom-0 left-0 h-0.5 bg-blue-800 transition-all duration-300 w-0 group-[.active-link]:w-full" />
              </NavLink>
            ))}
          </div>
          <button
            className="flex md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <Menu color="#ffffff" />
          </button>
        </div>
      </header>

    </>
  );
};

export default Header;