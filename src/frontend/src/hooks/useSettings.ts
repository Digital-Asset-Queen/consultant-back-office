import type { PracticeProfile } from "@/backend";
/**
 * useSettings — wraps PracticeProfile as app settings.
 * Re-exports the query/mutation from useQueries with a settings-centric API.
 */
import {
  useAddUpdatePracticeProfile,
  usePracticeProfile,
} from "@/hooks/useQueries";

export type AppSettings = PracticeProfile;

export function useSettings() {
  return usePracticeProfile();
}

export function useSaveSettings() {
  return useAddUpdatePracticeProfile();
}

export type { PracticeProfile };
