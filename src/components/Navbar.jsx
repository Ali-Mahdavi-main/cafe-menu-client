import { useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const pages = {
  "/dashboard": {
    title: "داشبورد",
    description: "نمای کلی کافه",
  },
  "/categories": {
    title: "دسته‌بندی‌ها",
    description: "مدیریت دسته‌بندی‌های منو",
  },
  "/menu-items": {
    title: "آیتم‌های منو",
    description: "مدیریت آیتم‌های منو",
  },
  "/settings": {
    title: "تنظیمات",
    description: "تنظیمات کافه",
  },
}

function Navbar() {
  const location = useLocation()
  const { user } = useAuth()

  const currentPage =
    pages[location.pathname] ?? {
      title: "",
      description: "",
    }

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      {/* عنوان صفحه */}
      <div>
        <h1 className="text-2xl font-bold">
          {currentPage.title}
        </h1>

        <p className="text-sm text-gray-500">
          {currentPage.description}
        </p>
      </div>

      {/* بخش راست */}
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="font-semibold">
            {user?.cafeName}
          </p>

          <p className="text-xs text-gray-500">
            {user?.userName}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-bold">
          {user?.cafeName?.charAt(0)}
        </div>
      </div>
    </header>
  )
}

export default Navbar