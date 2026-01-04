import { create } from "zustand";

interface Store {
  images: string[] | undefined;
  activeImage: string | undefined;
  lightboxOpened: boolean;

  setImages: (images: string[]) => void;
  setActiveImage: (image: string) => void;
  openLightbox: () => void;
  closeLightbox: () => void;
}

const initialState = {
  images: undefined,
  activeImage: undefined,
  lightboxOpened: false,
};

const useLightBoxStore = create<Store>((set) => ({
  ...initialState,
  setImages: (images) => set({ images }),
  setActiveImage: (image) => set({ activeImage: image }),
  openLightbox: () => set({ lightboxOpened: true }),
  closeLightbox: () => set({ lightboxOpened: false }),
}));

export default useLightBoxStore;
