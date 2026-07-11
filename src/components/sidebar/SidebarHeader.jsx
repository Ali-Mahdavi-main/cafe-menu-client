import { Coffee } from "lucide-react";

function SidebarHeader() {
  return (
    <div className="border-b p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
          <Coffee size={24} />
        </div>

        <div>

          <h2 className="font-bold text-lg">
            کافه‌منو
          </h2>

          <p className="text-sm text-muted-foreground">
            پنل مدیریت
          </p>

        </div>

      </div>

    </div>
  );
}

export default SidebarHeader;