import React, { useRef } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router";

import { NavBar } from ".";

import useAdminFeedbackLengthStore from "~/stores/adminUnredFeedbackStore";
import useAdminPendingRequestsLength from "~/stores/adminPendingRequestsLengthStore";

const translations = {
  requests: {
    ru: "Запросы",
    ee: "Päringud",
  },
  current: {
    ru: "Текущие",
    ee: "Praegused",
  },
  completed: {
    ru: "Завершённые",
    ee: "Lõpetatud",
  },
  feedback: {
    ru: "Обратная связь",
    ee: "Tagasiside",
  },
  unred: {
    ru: "Непрочитанные",
    ee: "Lugemata",
  },
  red: {
    ru: "Прочитанные",
    ee: "Läbiloetud",
  },
  manageContent: {
    ru: "Управление содержимым сайта",
    ee: "Veebisaidi sisu haldamine",
  },
  services: {
    ru: "Услуги",
    ee: "Teenused",
  },
  gallery: {
    ru: "Галерея",
    ee: "Galerii",
  },
  contactInfo: {
    ru: "Контактная информация",
    ee: "Kontaktandmed",
  },
  exit: {
    ru: "Выйти",
    ee: "Logi välja",
  },
};

type Props = {
  children: React.ReactNode;
};
const Drawer = ({ children }: Props) => {
  const drawerRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const unredFeedbackLength = useAdminFeedbackLengthStore(
    (state) => state.length
  );
  const pendingRequestsLength = useAdminPendingRequestsLength(
    (state) => state.length
  );

  const withLang = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("lang", lang);
    return params.toString();
  };

  //Handle navigation button click
  const handleNavigationButtonClick = () => {
    //Hide drawer
    drawerRef.current!.checked = false;
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        ref={drawerRef}
        id="my-drawer-1"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* Page content */}
      <div className="drawer-content pb-10">
        {/* Navigation */}
        <NavBar />

        {/* Outlet */}
        <div className=" px-10 mt-10">{children}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu menu-lg bg-base-200 min-h-full rounded-md w-80 p-4">
          {/* Link to request from users */}
          <li className="rounded-md">
            <details>
              <summary>{translations.requests[lang]}</summary>
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                    end
                  >
                    {translations.current[lang]}
                    {(pendingRequestsLength && pendingRequestsLength && (
                      <div className="badge badge-sm badge-secondary">
                        +{pendingRequestsLength}
                      </div>
                    )) ||
                      null}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/requests/completed",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                    end
                  >
                    {translations.completed[lang]}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Link to feedback */}
          <li className="rounded-md">
            <details>
              <summary>{translations.feedback[lang]}</summary>
              <ul>
                {/* Manage services */}
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/feedback/unred",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                  >
                    {translations.unred[lang]}
                    {(unredFeedbackLength && unredFeedbackLength && (
                      <div className="badge badge-sm badge-secondary">
                        +{unredFeedbackLength}
                      </div>
                    )) ||
                      null}
                  </NavLink>
                </li>

                {/* Manage gallery */}
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/feedback/red",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                  >
                    {translations.red[lang]}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Link to manage website content */}
          <li className="rounded-md">
            <details>
              <summary>{translations.manageContent[lang]}</summary>
              <ul>
                {/* Manage services */}
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/services",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                  >
                    {translations.services[lang]}
                  </NavLink>
                </li>

                {/* Manage gallery */}
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/gallery",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                  >
                    {translations.gallery[lang]}
                  </NavLink>
                </li>

                {/* Manage contact info */}
                <li>
                  <NavLink
                    className={({ isActive }) => `${isActive && "menu-active"}`}
                    to={{
                      pathname: "/admin/contact",
                      search: location.search,
                    }}
                    onClick={handleNavigationButtonClick}
                    end
                  >
                    {translations.contactInfo[lang]}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Language */}
          <li className="rounded-md flex justify-start items-center flex-row mt-5 gap-5">
            <NavLink
              to={{
                pathname: location.pathname,
                search: withLang("ee"),
              }}
              className={`btn ${searchParams.get("lang") === "ee" ? "btn-primary" : null}`}
            >
              EE
            </NavLink>
            <NavLink
              to={{
                pathname: location.pathname,
                search: withLang("ru"),
              }}
              className={`btn ${searchParams.get("lang") === "ru" ? "btn-primary" : null}`}
            >
              RU
            </NavLink>
          </li>

          {/* Logout button */}
          <li className="mt-10">
            <Link to="/admin/logout" className="text-error">
              {translations.exit[lang]}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
