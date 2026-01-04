import { useSearchParams } from "react-router";
import headerImage from "../assets/headerImage.jpg";

const translations = {
  header: {
    ru: "Выполняем свою работу качественно, ответственно и добросовестно",
    ee: "Teeme oma tööd kvaliteetselt, vastutustundlikult ja kohusetundlikult",
  },
  cta: {
    ru: "Ознакомиться с услугами",
    ee: "Tutvu teenustega",
  },
};

const Header = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl xl:text-5xl 2xl:text-7xl">
            {translations.header[lang]}
          </h2>

          <div className="mt-4 md:mt-8">
            <button
              onClick={() => {
                document.querySelector("#services")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="btn btn-primary lg:btn-lg xl:btn-xl"
            >
              {translations.cta[lang]}
            </button>
          </div>
        </div>
      </div>

      <img
        alt=""
        src={headerImage}
        className="h-56 w-full object-cover sm:h-full"
      />
    </section>
  );
};

export default Header;
