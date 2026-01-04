import { create } from "zustand";

interface Store {
  open: boolean;
  modalVariant: string | null;
  actionRoute: string | null;
  itemId: string | null;
  innerContent: React.ReactNode | null;

  toggleModal: () => void;
  openModal: (variant: string) => void;
  closeModal: () => void;

  setActionRoute: (route: string) => void;

  setItemId: (id: string) => void;

  setInnerContent: (children: React.ReactNode) => void;
}

const useAdminModalStore = create<Store>((set) => ({
  open: false,
  actionRoute: null,
  modalVariant: null,
  itemId: null,
  innerContent: null,

  toggleModal: () => set((state) => ({ open: !state.open })),
  openModal: (variant) => set({ open: true, modalVariant: variant }),
  closeModal: () =>
    set({ open: false, actionRoute: null, itemId: null, modalVariant: null }),

  setActionRoute: (route) => set({ actionRoute: route }),

  setItemId: (id) => set({ itemId: id }),

  setInnerContent: (children) => set({ innerContent: children }),
}));

export default useAdminModalStore;
