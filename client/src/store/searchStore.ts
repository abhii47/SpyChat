import { create } from "zustand";
import type { SearchUser } from "../types";

interface SearchState {
    query:string,
    userResults:SearchUser[],
    isSearching:boolean,
    isOpen:boolean

    setQuery: (q:string) => void
    setUserResults: (users:SearchUser[]) => void
    setSearching: (v: boolean) => void
    setOpen: (v: boolean) => void
    clearSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  userResults: [],
  isSearching: false,
  isOpen: false,

  setQuery: (q) => set({ query: q }),
  setUserResults: (users) => set({ userResults: users }),
  setSearching: (v) => set({ isSearching: v }),
  setOpen: (v) => set({ isOpen: v }),
  clearSearch: () => set({
    query: '',
    userResults: [],
    isOpen: false,
    isSearching: false,
  }),
}))