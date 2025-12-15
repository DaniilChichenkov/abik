import { useState } from "react";

//Services categories (Will be fetched from db)
const fakeServicesCategories = [
  {
    title: "Все",
    id: "all",
  },
  {
    title: "Сезонные работы",
    id: "season",
  },
  {
    title: "Частный клиент",
    id: "private",
  },
  {
    title: "Квартирное товарищество",
    id: "flats",
  },
];
//Services list fake items (Will be fetched from db)
const fakeServicesItems = [
  // ------- SEASON -------
  { category: "season", title: "Уборка снега", price: 15 },
  { category: "season", title: "Посыпка дорожек песком", price: 12 },
  { category: "season", title: "Чистка крыши от наледи", price: 28 },
  { category: "season", title: "Вывоз снежных масс", price: 40 },
  { category: "season", title: "Расчистка парковочных мест", price: 18 },
  { category: "season", title: "Обслуживание зимой территории", price: 22 },

  // ------- ALL -------
  { category: "all", title: "Генеральная уборка", price: 55 },
  { category: "all", title: "Дезинфекция помещений", price: 30 },
  { category: "all", title: "Мытьё окон", price: 20 },
  { category: "all", title: "Чистка ковров", price: 25 },
  { category: "all", title: "Комплексное обслуживание", price: 48 },
  { category: "all", title: "Базовая уборка территории", price: 18 },

  // ------- FLATS -------
  { category: "flats", title: "Уборка квартиры", price: 35 },
  { category: "flats", title: "Поддерживающая уборка", price: 22 },
  { category: "flats", title: "Мытьё балкона", price: 15 },
  { category: "flats", title: "Уборка после ремонта", price: 70 },
  { category: "flats", title: "Чистка кухни и санузлов", price: 28 },
  { category: "flats", title: "Наведение порядка в комнате", price: 17 },

  // ------- PRIVATE -------
  { category: "private", title: "Уборка частного дома", price: 65 },
  {
    category: "private",
    title: "Обслуживание придомовой территории",
    price: 32,
  },
  { category: "private", title: "Чистка гаража", price: 20 },
  { category: "private", title: "Уход за садом", price: 27 },
  { category: "private", title: "Мытьё фасада", price: 45 },
  { category: "private", title: "Уборка участка после работ", price: 38 },
];

const ServicesCategorySelectionButton = ({
  content,
  active,
}: {
  content: string;
  active?: boolean;
}) => {
  return (
    <button className={`btn 2xl:btn-lg ${active && "btn-primary"}`}>
      {content}
    </button>
  );
};

const ServiceItem = ({ title, price }: { title: string; price: number }) => {
  return (
    <div className="card card-border bg-base-100 w-full">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold 2xl:text-3xl">{title}</h2>
        <p className="text-lg 2xl:text-xl">
          Цена: <span className="font-bold">{price}</span>
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary 2xl:btn-lg">
            Оставить заявку
          </button>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  //Fake
  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState("flats");

  return (
    <section>
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-20 xl:py-20 2xl:px-64 2xl:py-44">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8 lg:gap-x-10">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="max-w-prose md:max-w-none text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl xl:text-4xl 2xl:text-5xl">
                Наши Услуги
              </h2>

              {/* Services Selection */}
              <div className="flex flex-col md:flex-row justify-around items-center lg:justify-start flex-wrap gap-x-2 gap-y-3 mt-5">
                {fakeServicesCategories.map((item) => (
                  <ServicesCategorySelectionButton
                    content={item.title}
                    active={item.id === "season"}
                    key={item.id}
                  />
                ))}
              </div>

              {/* 
              <p className="mt-4 text-pretty text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                doloremque saepe architecto maiores repudiandae amet perferendis
                repellendus, reprehenderit voluptas sequi.
              </p> */}
            </div>
          </div>

          {/* Services list */}
          <div className="md:col-span-4 lg:col-span-3 mt-10 lg:mt-0 flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-x-10 2xl:gap-x-16 md:items-start items-center gap-y-8">
            {fakeServicesItems
              .filter((item) => item.category === selectedServiceCategory)
              .map((item) => (
                <ServiceItem
                  title={item.title}
                  price={item.price}
                  key={item.title}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
