import { useSearchParams } from "react-router";
import headerImage from "../assets/header.png";

const translations = {
  header: {
    ru: "Бытовые услуги, обслуживание и ремонт в Ида-Вирумаа для квартирных товариществ и частных лиц",
    ee: "Koduteenused, hooldus ja remont Ida-Viru maakonnas korteriühistutele ja eraisikutele",
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
      <div className="p-8 md:p-8 lg:px-16 lg:py-12 h-full">
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right h-full flex flex-col justify-center">
          <h1
            className={`text-2xl font-bold text-gray-900 ${lang === "ee" ? "md:text-2xl lg:text-3xl xl:text-5xl 2xl:text-6xl" : "md:text-xl lg:text-3xl xl:text-3xl 2xl:text-5xl"}`}
          >
            {translations.header[lang]}
          </h1>

          <div className="mt-4 md:mt-8">
            <button
              onClick={() => {
                document.querySelector("#services")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="btn btn-lg btn-primary lg:btn-xl"
            >
              {translations.cta[lang]}
            </button>
          </div>
        </div>
      </div>

      <img
        alt=""
        src={headerImage}
        className="h-full w-full object-cover md:object-contain"
      />
    </section>
  );
};

export default Header;
