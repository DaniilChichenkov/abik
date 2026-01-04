import { useSearchParams } from "react-router";

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

const Footer = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const handleNavigationButtonClick = (id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center w-full">
          <div className="size-20">
            <img src={logo} alt="logo" className="aspect-square w-full" />
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
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
    </footer>
  );
};

export default Footer;
