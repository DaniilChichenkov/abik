import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import useLightBoxStore from "~/stores/LightBoxStore";

const LightBox = () => {
  //Images from store
  const images = useLightBoxStore((state) => state.images);
  const activeImage = useLightBoxStore((state) => state.activeImage);
  const setActiveImage = useLightBoxStore((state) => state.setActiveImage);
  const lightboxOpened = useLightBoxStore((state) => state.lightboxOpened);
  const closeLightbox = useLightBoxStore((state) => state.closeLightbox);

  //Previous / Next buttons disabling/enabling
  const [previousImageButtonDisabled, setPreviousImageButtonDisabled] =
    useState(false);
  const [nextImageButtonDisabled, setNextImageButtonDisabled] = useState(false);

  //Refs for images and images container (To show active image)
  const imagesInContainerRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});

  //Track current active image index (To display it in UI)
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  //Function to set refs of images
  const setImagesRefs = (src: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      imagesInContainerRefs.current[src] = el;
    } else {
      delete imagesInContainerRefs.current[src];
    }
  };

  //Enable / Disable scrolling
  useEffect(() => {
    if (lightboxOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }

    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [lightboxOpened]);

  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  //Show next image
  const handleNextImageButtonClick = () => {
    //Find current active image index
    const currentActiveImageIndex = images!.findIndex(
      (item) => item === activeImage
    );

    //If image was found
    if (currentActiveImageIndex >= 0) {
      //Check if image is not last in the array
      if (currentActiveImageIndex < images!.length - 1) {
        setActiveImage(images![currentActiveImageIndex + 1]);
      }
    }
  };

  //Track current active image index
  useEffect(() => {
    //If images are assigned
    if (images) {
      const currentActiveImageIndex = images!.findIndex(
        (item) => item === activeImage
      );

      setActiveImageIndex(currentActiveImageIndex);

      if (activeImage) {
        const activeImageElement = imagesInContainerRefs.current[activeImage];
        if (activeImageElement) {
          activeImageElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }

      //Disable previous image button when first image opened
      if (currentActiveImageIndex === 0) {
        setNextImageButtonDisabled(false);
        setPreviousImageButtonDisabled(true);

        //Disable next image button when last image opened
      } else if (currentActiveImageIndex === images!.length - 1) {
        setPreviousImageButtonDisabled(false);
        setNextImageButtonDisabled(true);

        //Enable all buttons in other cases
      } else {
        setNextImageButtonDisabled(false);
        setPreviousImageButtonDisabled(false);
      }
    }
  }, [activeImage, images]);

  //Show previous image
  const handlePreviousImageButtonClick = () => {
    //Find current active image index
    const currentActiveImageIndex = images!.findIndex(
      (item) => item === activeImage
    );

    //If image was found
    if (currentActiveImageIndex >= 0) {
      //Check if image is not last in the array
      if (currentActiveImageIndex > 0) {
        setActiveImage(images![currentActiveImageIndex - 1]);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 place-content-center bg-black bg-opacity-90 ${
        !lightboxOpened && "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      {/* Dedicated button to close lightbox */}
      <button
        className="absolute top-0 right-0 mt-5 mr-5 z-10 cursor-pointer"
        onClick={closeLightbox}
      >
        <X color="#fff" size={30} />
      </button>

      {/* Close lightbox buttons (Background) */}
      <button
        className="absolute inset-0 bg-transparent cursor-default z-0"
        id="lightboxBackdrop"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (e.currentTarget.id === "lightboxBackdrop") {
            closeLightbox();
          }
        }}
      />

      {/* Lightbox */}
      <div className="w-full flex justify-between items-center relative z-10">
        {/* Previous image btn */}
        <button
          disabled={previousImageButtonDisabled}
          onClick={handlePreviousImageButtonClick}
          className="w-1/12"
        >
          <ChevronLeft
            className="w-full scale-125"
            color={previousImageButtonDisabled ? "gray" : "white"}
          />
        </button>

        {/* Image */}
        <div className="mx-auto z-10 relative flex justify-center items-center max-w-[90vw] max-h-[70svh] w-[70vw] h-[70svh] md:h-[60svh] md:w-[70svh]">
          {/* Body */}
          <img
            className="w-full max-h-full object-contain  bg-white rounded-lg shadow-lg"
            src={activeImage}
            alt="#"
            draggable={false}
          />
        </div>

        {/* Next image btn */}
        <button
          disabled={nextImageButtonDisabled}
          onClick={handleNextImageButtonClick}
          className="w-1/12"
        >
          <ChevronRight
            className="w-full scale-125"
            color={nextImageButtonDisabled ? "gray" : "white"}
          />
        </button>
      </div>

      {/* Paggination and images counter */}
      <div className="absolute bottom-0 w-full">
        {/* Images counter */}
        <div className="w-full  flex justify-end pr-4 mb-5">
          <p className="text-white md:text-2xl">
            {activeImageIndex !== null && activeImageIndex + 1} /{" "}
            {images && images.length}
          </p>
        </div>

        {/* Paggination */}
        <div className="hidden w-full lg:flex justify-start bg-black bg-opacity-80 overflow-x-scroll z-10">
          {/* Images slider */}
          {images &&
            images.length &&
            images.map((item) => (
              <button
                key={item}
                onClick={() => handleImageClick(item)}
                className="w-3/12 md:w-2/12 lg:w-1/12 xl:w-[4%] shrink-0 aspect-square overflow-hidden"
                ref={setImagesRefs(item)}
              >
                <img
                  src={item}
                  alt="#"
                  key={item}
                  className={`border-[0.5px] m-0 p-0 w-full h-full object-cover ${
                    activeImage === item ? "border-white" : "border-gray-500"
                  }`}
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LightBox;
