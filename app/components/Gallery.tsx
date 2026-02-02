import { NavLink, useSearchParams } from "react-router";

import useLightBoxStore from "~/stores/LightBoxStore";

const translations = {
  gallery: {
    ru: "Галерея",
    ee: "Galerii",
  },
};

const GalleryCategorySelectionButton = ({
  content,
  active,
  _id,
}: {
  content: string;
  active?: boolean;
  _id: string;
}) => {
  const [searchParams] = useSearchParams();

  const handleNavigation = () => {
    const params = new URLSearchParams(searchParams);
    params.set("gallery", _id);
    return `/?${params.toString()}`;
  };

  return (
    <NavLink
      to={handleNavigation()}
      preventScrollReset
      className={`btn h-full 2xl:btn-lg border-dashed border-blue-600 border-2 ${active && "btn-primary border-none"}`}
    >
      <p className="py-2 lg:py-5 lg:text-xl">{content && content.trim()}</p>
    </NavLink>
  );
};

const GalleryItem = ({
  src,
  onClick,
}: {
  src: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className="w-full cursor-pointer">
      <img src={src} alt="#" className="aspect-square w-full" />
    </button>
  );
};

type Props = {
  selectedGalleryContent: string[];
  galleryCategories: {
    _id: string;
    title: {
      ee: string;
      ru: string;
    };
  }[];
};
const Gallery = ({ selectedGalleryContent, galleryCategories }: Props) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  const openLightbox = useLightBoxStore((state) => state.openLightbox);
  const setImages = useLightBoxStore((state) => state.setImages);
  const setActiveImage = useLightBoxStore((state) => state.setActiveImage);

  //Set images URL`s to store and open Lightbox
  const handleImageClick = (imageUrl: string) => {
    setImages(selectedGalleryContent);
    setActiveImage(imageUrl);
    openLightbox();
  };

  return (
    <section id="gallery">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-20 xl:py-20 2xl:px-64 2xl:py-44">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8 lg:gap-x-10">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="max-w-prose md:max-w-none text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl xl:text-4xl 2xl:text-5xl">
                {translations.gallery[lang]}
              </h2>

              {/* Gallery category Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-x-4 gap-y-4 mt-5">
                {galleryCategories.map((item) => (
                  <GalleryCategorySelectionButton
                    content={item.title[lang]}
                    active={searchParams.get("gallery") === item._id}
                    _id={item._id}
                    key={item._id}
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
            {selectedGalleryContent.map((item) => (
              <GalleryItem
                onClick={() => handleImageClick(item)}
                key={item}
                src={item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
