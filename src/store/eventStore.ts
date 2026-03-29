import { create } from 'zustand';
import { GAME_EVENTS } from '../data/eventData';
import { useGameStore } from './gameStore';
import { useSkillTreeStore } from './skillTreeStore';
import type { GameEvent } from '../types';

interface EventState {
  activeEvent: GameEvent | null;
  timeLeft: number;
  lastEventTime: number; // timestamp
  
  // Actions
  triggerRandomEvent: (regionIndex: number) => void;
  resolveEvent: (choiceId: string | null) => void; // null means timed out
  tick: (delta: number, regionIndex: number) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  activeEvent: null,
  timeLeft: 0,
  lastEventTime: Date.now(),

  triggerRandomEvent: (regionIndex: number) => {
    const state = get();
    if (state.activeEvent) return;

    const availableEvents = GAME_EVENTS.filter(e => !e.minRegion || regionIndex >= e.minRegion);
    if (availableEvents.length === 0) return;

    // Weighted random selection
    const totalWeight = availableEvents.reduce((acc, current) => acc + current.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedEvent = availableEvents[0];
    for (const event of availableEvents) {
      if (random < event.weight) {
        selectedEvent = event;
        break;
      }
      random -= event.weight;
    }

    set({
      activeEvent: selectedEvent,
      timeLeft: selectedEvent.duration,
      lastEventTime: Date.now()
    });
  },

  resolveEvent: (choiceId: string | null) => {
    const state = get();
    const event = state.activeEvent;
    if (!event) return;

    const gameStore = useGameStore.getState();
    const choice = event.choices.find(c => c.id === choiceId);
    
    // Default outcome if no choice or timed out
    const result = choice ? choice.result : event.choices[0].result;

    // Apply results to gameStore
    if (result.se) gameStore.addSE(result.se);
    if (result.cs) gameStore.addCS(result.cs);
    if (result.vt) gameStore.addVT(result.vt);
    if (result.dp) {
        useSkillTreeStore.getState().addDP(result.dp);
    }
    
    gameStore.addNotification(result.message, result.type || 'info');

    set({ activeEvent: null, timeLeft: 0 });
  },

  tick: (delta: number, regionIndex: number) => {
    const state = get();
    
    if (state.activeEvent) {
      const newTime = state.timeLeft - delta;
      if (newTime <= 0) {
        get().resolveEvent(null);
      } else {
        set({ timeLeft: newTime });
      }
    } else {
      // Chance to trigger every ~200 seconds average
      const chance = (1 / 200) * delta;
      if (Math.random() < chance && (Date.now() - state.lastEventTime > 60000)) {
        get().triggerRandomEvent(regionIndex);
      }
    }
  }
}));
