import { Link } from "react-router-dom";

const Sidebar = () => {
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

  return (
    <div className="flex flex-col justify-start items-start">
      {navbarOptions.map((option) => (
        <Link to={option.to}>{option.title}</Link>
      ))}
    </div>
  )
}

export default Sidebar