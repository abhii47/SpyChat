import { create } from 'zustand'
import type { ActiveChat } from '../types'

interface UiState {
  activeChat: ActiveChat | null
  sidebarTab: 'conversations' | 'groups'
  isMobileSidebarOpen: boolean

  setActiveChat: (chat: ActiveChat | null) => void
  setSidebarTab: (tab: 'conversations' | 'groups') => void
  toggleMobileSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  activeChat: null,
  sidebarTab: 'conversations',
  isMobileSidebarOpen: false,

  setActiveChat: (chat) => set({ activeChat: chat }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
}))