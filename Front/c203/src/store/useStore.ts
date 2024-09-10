import { create } from "zustand";

interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
}

const useStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
}));

export default useStore;
