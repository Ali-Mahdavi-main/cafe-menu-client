import { navigation } from "@/config/navigation";
import SidebarItem from "./SidebarItem";

function SidebarNavigation() {
  return (
    <nav className="flex-1 px-4 py-6">

      {navigation.map((item) => (
        <SidebarItem
          key={item.href}
          item={item}
        />
      ))}

    </nav>
  );
}

export default SidebarNavigation;