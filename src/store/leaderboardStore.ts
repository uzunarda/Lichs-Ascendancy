import { create } from 'zustand';

interface LeaderboardEntry {
  rank: number;
  name: string;
  totalSE: string;
  isPlayer?: boolean;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  refresh: () => void;
}

const MOCK_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Azrael_The_Void', totalSE: '1.2e66' },
  { rank: 2, name: 'Soul_Reaper_88', totalSE: '9.5e64' },
  { rank: 3, name: 'Lich_King_Arda', totalSE: '8.2e62' },
  { rank: 4, name: 'Shadow_Stalker', totalSE: '4.5e60' },
  { rank: 5, name: 'Dark_Monarch', totalSE: '1.2e58' },
  { rank: 6, name: 'Necro_Lord', totalSE: '8.9e55' },
  { rank: 7, name: 'Void_Walker', totalSE: '3.4e52' },
  { rank: 8, name: 'Eternal_Vampire', totalSE: '1.5e50' },
  { rank: 9, name: 'Ghost_King', totalSE: '9.2e48' },
  { rank: 10, name: 'Bone_Master', totalSE: '4.7e46' },
];

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: MOCK_DATA,
  isLoading: false,
  refresh: () => {
    set({ isLoading: true });
    // Simulate API fetch
    setTimeout(() => {
      set({ isLoading: false });
    }, 1000);
  },
}));
