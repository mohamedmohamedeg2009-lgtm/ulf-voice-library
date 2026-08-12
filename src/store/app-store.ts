import { create } from "zustand";
import { toggleFavorite } from "@/features/favorites/favorites";
import { projectInputSchema, type Project } from "@/features/projects/schemas";
import type { Recording } from "@/features/history/schemas";

interface AppState {
  selectedVoiceId: string | null;
  favoriteIds: string[];
  projects: Project[];
  recordings: Recording[];
  selectVoice: (voiceId: string) => void;
  toggleFavorite: (voiceId: string) => void;
  createProject: (input: { name: string; description?: string }) => Project | null;
  deleteProject: (projectId: string) => void;
  addRecording: (recording: Recording) => void;
  deleteRecording: (recordingId: string) => void;
  reset: () => void;
}

const initialState = { selectedVoiceId: null, favoriteIds: [], projects: [], recordings: [] };

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  selectVoice: (selectedVoiceId) => set({ selectedVoiceId }),
  toggleFavorite: (voiceId) => set({ favoriteIds: toggleFavorite(get().favoriteIds, voiceId) }),
  createProject: (input) => {
    const parsed = projectInputSchema.safeParse(input);
    if (!parsed.success) return null;
    const now = new Date().toISOString();
    const project: Project = { id: crypto.randomUUID(), ...parsed.data, createdAt: now, updatedAt: now };
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },
  deleteProject: (projectId) => set((state) => ({ projects: state.projects.filter((item) => item.id !== projectId) })),
  addRecording: (recording) => set((state) => ({ recordings: [recording, ...state.recordings] })),
  deleteRecording: (recordingId) => set((state) => ({ recordings: state.recordings.filter((item) => item.id !== recordingId) })),
  reset: () => set(initialState),
}));
