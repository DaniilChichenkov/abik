import { create } from "zustand";

interface Store {
  open: boolean;
  innerContent: React.ReactNode | null;

  openModal: () => void;
  closeModal: () => void;
  setInnerContent: (content: React.ReactNode) => void;
}

const useAdminBetterModalStore = create<Store>((set) => ({
  open: false,
  innerContent: null,

  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
  setInnerContent: (innerContent) => set({ innerContent }),
}));

export default useAdminBetterModalStore;
