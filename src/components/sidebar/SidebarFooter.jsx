import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function SidebarFooter() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="border-t p-4">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-bold">

          {user?.cafeName?.charAt(0)}

        </div>

        <div>

          <p className="font-semibold">
            {user?.cafeName}
          </p>

          <p className="text-sm text-muted-foreground">
            {user?.userName}
          </p>

        </div>

      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition hover:bg-red-50"
      >
        <LogOut size={20} />

        خروج
      </button>

    </div>
  );
}

export default SidebarFooter;