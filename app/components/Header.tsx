import headerImage from "../assets/headerImage.jpg";

const Header = () => {
  return (
    <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl xl:text-5xl 2xl:text-7xl">
            Выполняем свою работу качественно, ответственно и добросовестно
          </h2>

          <div className="mt-4 md:mt-8">
            {/* <a
              href="#"
              className="inline-block rounded-sm bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:ring-2 focus:ring-yellow-400 focus:outline-hidden"
            >
              Ознакомиться с услугами
            </a> */}
            <button className="btn btn-primary lg:btn-lg xl:btn-xl">
              Ознакомиться с услугами
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
