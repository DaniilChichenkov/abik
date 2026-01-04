import "flag-icons/css/flag-icons.min.css";
import { Phone, Mail, Menu } from "lucide-react";
import { useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

import logo from "../assets/logo.png";

const translations = {
  services: {
    ru: "Услуги",
    ee: "Teenused",
  },
  gallery: {
    ru: "Галерея",
    ee: "Galerii",
  },
  feedback: {
    ru: "Обратная связь",
    ee: "Tagasiside",
  },
};

//Navigation Bar header contains contact info and language selection

const NavBarHeader = ({ email, tel }: { email: string; tel: string }) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const withLang = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("lang", lang);
    return params.toString();
  };

  return (
    <section className="w-full flex justify-center md:justify-between items-center gap-y-5 bg-gray-900 py-4 px-4 md:px-10 lg:px-20 xl:px-32 2xl:px-64 text-white">
      {/* Contact details */}
      <div className="flex justify-center items-center flex-wrap gap-x-2">
        {/* Phone */}
        <div className="flex justify-start items-center gap-x-2">
          <Phone size={16} />
          <p className="text-sm 2xl:text-lg">{tel ? tel : null}</p>
        </div>

        {/* Divider */}
        <p className="2xl:text-lg"> / </p>

        {/* Email */}
        <div className="flex justify-start items-center gap-x-2">
          <Mail size={16} />
          <p className="text-sm 2xl:text-lg">{email ? email : null}</p>
        </div>
      </div>

      {/* Language Selection (Visible only > md) */}
      <div className="hidden md:flex justify-end items-center gap-x-2 2xl:text-lg">
        <NavLink
          to={{
            pathname,
            search: withLang("ee"),
          }}
        >
          EE
        </NavLink>
        <NavLink
          to={{
            pathname,
            search: withLang("ru"),
          }}
        >
          RU
        </NavLink>
      </div>
    </section>
  );
};

//Navbar menu mobile
const NavBarMenuMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const withLang = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("lang", lang);
    return params.toString();
  };

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

  const handleMenuItemClick = (id: string) => {
    closeMenu();

    if (pathname !== "/") {
      navigate(`/${search}#${id}`);
      return;
    }

    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
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
          <button
            className="cursor-pointer"
            onClick={() => handleMenuItemClick("services")}
          >
            {translations.services[lang]}
          </button>
        </li>
        <li className="text-lg px-2">
          <button
            className="cursor-pointer"
            onClick={() => handleMenuItemClick("gallery")}
          >
            {translations.gallery[lang]}
          </button>
        </li>
        <li className="text-lg px-2">
          <button
            className="cursor-pointer"
            onClick={() => handleMenuItemClick("feedback")}
          >
            {translations.feedback[lang]}
          </button>
        </li>
        <li>
          <div className="w-full flex justify-between items-center mx-auto">
            <NavLink
              to={{
                pathname,
                search: withLang("ee"),
              }}
              className={`flex gap-x-2 items-center btn ${lang === "ee" ? "btn-primary" : null}`}
            >
              <span className="fi fi-ee"></span>EE
            </NavLink>
            <NavLink
              to={{
                pathname,
                search: withLang("ru"),
              }}
              className={`flex gap-x-2 items-center btn ${lang === "ru" ? "btn-primary" : null}`}
            >
              <span className="fi fi-ru"></span>RU
            </NavLink>
          </div>
        </li>
      </ul>
    </details>
  );
};

const NavBarMain = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const handleNavigationButtonClick = (id: string) => {
    if (pathname !== "/") {
      navigate(`/${search}#${id}`);
      return;
    }

    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <nav>
      <div className="navbar flex justify-between items-center bg-base-100 shadow-sm md:px-10 lg:px-20 xl:px-32 2xl:px-64">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl size-20">
            <img src={logo} alt="logo" className="w-full aspect-square" />
          </a>
        </div>

        {/* Mobile navigation + lang selection menu */}
        <div className="md:hidden">
          <NavBarMenuMobile />
        </div>

        {/* Default navigation */}
        <div className="flex-none hidden md:block">
          <ul className="menu menu-horizontal flex flex-wrap items-center justify-center gap-x-4 lg:gap-x-8">
            <li className="text-lg 2xl:text-xl">
              <button
                className="cursor-pointer"
                onClick={() => handleNavigationButtonClick("services")}
              >
                {translations.services[lang]}
              </button>
            </li>
            <li className="text-lg 2xl:text-xl">
              <button
                className="cursor-pointer"
                onClick={() => handleNavigationButtonClick("gallery")}
              >
                {translations.gallery[lang]}
              </button>
            </li>
            <li className="text-lg 2xl:text-xl">
              <button
                className="cursor-pointer"
                onClick={() => handleNavigationButtonClick("feedback")}
              >
                {translations.feedback[lang]}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavBar = ({ email, tel }: { email: string; tel: string }) => {
  return (
    <>
      <NavBarHeader email={email} tel={tel} />
      <NavBarMain />
    </>
  );
};

export default NavBar;
