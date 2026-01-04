import { create } from "zustand";

interface Store {
  variant: "success" | "error" | null;
  open: boolean;
  innerContent: React.ReactNode | null;

  openToast: () => void;
  closeToast: () => void;
  setToastVariant: (variant: "success" | "error") => void;
  setToastInnerContent: (content: React.ReactNode) => void;
  clearToastInnerContent: () => void;
}
const useToastStore = create<Store>((set) => ({
  variant: null,
  open: false,
  innerContent: null,

  openToast: () => set({ open: true }),
  closeToast: () => set({ open: false }),
  setToastVariant: (variant) => set({ variant }),
  setToastInnerContent: (content) => set({ innerContent: content }),
  clearToastInnerContent: () => set({ innerContent: null }),
}));

export default useToastStore;
