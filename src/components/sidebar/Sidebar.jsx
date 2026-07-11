import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r bg-white">
      <SidebarHeader />

      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;