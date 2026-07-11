import { Outlet } from "react-router-dom"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/sidebar/Sidebar"

function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-muted/30">

      <Sidebar
        collapsed={collapsed}
        />

      <main className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>

      </main>

    </div>
  )
}

export default DashboardLayout