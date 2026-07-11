import { NavLink } from "react-router-dom";

function SidebarItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `
        mb-2 flex items-center gap-3 rounded-xl px-4 py-3
        transition-all duration-200
        ${
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-muted hover:text-black"
        }
        `
      }
    >
      <Icon size={20} />

      <span className="font-medium">
        {item.title}
      </span>

    </NavLink>
  );
}

export default SidebarItem;