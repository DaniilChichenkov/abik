const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center text-teal-600">
          Abik (Здесь потом будет логотип)
        </div>

        {/* <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
          consequuntur amet culpa cum itaque neque.
        </p> */}

        <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          <li className="md:text-lg 2xl:text-xl">Услуги</li>
          <li className="md:text-lg 2xl:text-xl">Галерея</li>
          <li className="md:text-lg 2xl:text-xl">Обратная связь</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
