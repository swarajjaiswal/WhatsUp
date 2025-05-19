import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme:localStorage.getItem("whatsup-theme")||"sythwave",
    setTheme: (theme) => {
        localStorage.setItem("whatsup-theme", theme) 
        set({ theme })},
}))