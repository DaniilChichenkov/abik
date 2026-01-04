import { create } from "zustand";

interface Store {
  length: number;
  setLength: (length: number) => void;
}
const useAdminFeedbackLengthStore = create<Store>((set) => ({
  length: 0,
  setLength: (length) => set({ length }),
}));

export default useAdminFeedbackLengthStore;
