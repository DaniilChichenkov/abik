import { Menu } from "lucide-react";
import { useSearchParams } from "react-router";

const translations = {
  dashboard: {
    ru: "Панель управления",
    ee: "Juhtpaneel",
  },
};

const NavBar = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{translations.dashboard[lang]}</a>
      </div>
      <div className="flex-none">
        <div className="drawer-content">
          <label htmlFor="my-drawer-1" className="btn drawer-button lg:hidden">
            <Menu />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
