import "flag-icons/css/flag-icons.min.css";
import { Phone, Mail, Menu } from "lucide-react";
import { useState } from "react";

//Navigation Bar header contains contact info and language selection
const NavBarHeader = () => {
  return (
    <section className="w-full flex justify-center md:justify-between items-center gap-y-5 bg-gray-900 py-4 px-4 md:px-10 lg:px-20 xl:px-32 2xl:px-64 text-white">
      {/* Contact details */}
      <div className="flex justify-center items-center gap-x-2">
        {/* Phone */}
        <div className="flex justify-start items-center gap-x-2">
          <Phone size={16} />
          <p className="text-sm 2xl:text-lg">+372 5366 4448</p>
        </div>

        {/* Divider */}
        <p className="2xl:text-lg"> / </p>

        {/* Email */}
        <div className="flex justify-start items-center gap-x-2">
          <Mail size={16} />
          <p className="text-sm 2xl:text-lg">info@abik.ee</p>
        </div>
      </div>

      {/* Language Selection (Visible only > md) */}
      <div className="hidden md:flex justify-end items-center gap-x-2 2xl:text-lg">
        <p>RU</p>
        <p>EE</p>
      </div>
    </section>
  );
};

//Navbar menu mobile
const NavBarMenuMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuOpenButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMenu();
  };

  const handleMenuItemClick = () => {
    closeMenu();
  };

  return (
    <details className="dropdown dropdown-end" open={menuOpen}>
      <summary
        onClick={handleMenuOpenButtonClick}
        className="btn btn-ghost m-1"
      >
        <Menu />
      </summary>
      <ul className="menu gap-y-3 dropdown-content bg-base-100 rounded-box z-1 w-52 shadow-sm border border-base-300">
        <li className="text-lg px-2">
          <button onClick={handleMenuItemClick}>Услуги</button>
        </li>
        <li className="text-lg px-2">
          <button onClick={handleMenuItemClick}>Галерея</button>
        </li>
        <li className="text-lg px-2">
          <button onClick={handleMenuItemClick}>Обратная связь</button>
        </li>
        <li>
          <div className="w-full flex justify-between items-center mx-auto">
            <button className="flex gap-x-2 items-center btn btn-primary">
              <span className="fi fi-ee"></span>EE
            </button>
            <button className="flex gap-x-2 items-center btn">
              <span className="fi fi-ru"></span>RU
            </button>
          </div>
        </li>
      </ul>
    </details>
  );
};

const NavBarMain = () => {
  return (
    <nav>
      <div className="navbar flex justify-between items-center bg-base-100 shadow-sm md:px-10 lg:px-20 xl:px-32 2xl:px-64">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Abik</a>
        </div>

        {/* Mobile navigation + lang selection menu */}
        <div className="md:hidden">
          <NavBarMenuMobile />
        </div>

        {/* Default navigation */}
        <div className="flex-none hidden md:block">
          <ul className="menu menu-horizontal flex flex-wrap items-center justify-center gap-x-4 lg:gap-x-8">
            <li className="text-lg 2xl:text-xl">Услуги</li>
            <li className="text-lg 2xl:text-xl">Галерея</li>
            <li className="text-lg 2xl:text-xl">Обратная связь</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavBar = () => {
  return (
    <>
      <NavBarHeader />
      <NavBarMain />
    </>
  );
};

export default NavBar;
