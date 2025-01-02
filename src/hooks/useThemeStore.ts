import { create } from "zustand";
import { combine } from "zustand/middleware";

const useThemeStore = create(
  combine({ theme: "dark" }, set => ({
    setTheme: (newTheme: string) => set(() => ({ theme: newTheme })),
  })),
);

export default useThemeStore;
