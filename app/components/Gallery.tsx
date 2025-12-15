import example from "../assets/headerImage.jpg";
const fakeGalleryCategories = [
  {
    title: "Работы",
    id: "all",
  },
  {
    title: "Результаты",
    id: "season",
  },
  {
    title: "Процесс",
    id: "private",
  },
  {
    title: "Объекты",
    id: "flats",
  },
];

const GalleryCategorySelectionButton = ({
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

const GalleryItem = () => {
  return <img src={example} alt="#" className="aspect-square w-full" />;
};

const Gallery = () => {
  return (
    <section>
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-20 xl:py-20 2xl:px-64 2xl:py-44">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8 lg:gap-x-10">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="max-w-prose md:max-w-none text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl xl:text-4xl 2xl:text-5xl">
                Галерея
              </h2>

              {/* Gallery category Selection */}
              <div className="flex justify-around items-center lg:justify-start flex-wrap gap-x-2 gap-y-3 mt-5">
                {fakeGalleryCategories.map((item) => (
                  <GalleryCategorySelectionButton
                    content={item.title}
                    active={item.id === "private"}
                    key={item.id}
                  />
                ))}
              </div>

              {/* <p className="mt-4 text-pretty text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                doloremque saepe architecto maiores repudiandae amet perferendis
                repellendus, reprehenderit voluptas sequi.
              </p> */}
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3 mt-10 lg:mt-0 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-1 md:items-start items-center gap-y-1">
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
            <GalleryItem />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
