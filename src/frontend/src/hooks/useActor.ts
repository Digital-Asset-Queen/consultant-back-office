// Local useActor wrapper that provides a no-argument API
// by binding the project's createActor function from backend.ts

import { useActor as useCaffeineActor } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";
import { createActor } from "../backend";
import type { BackendActor } from "../types/actor";

export interface UseActorResult {
  actor: BackendActor | null;
  isFetching: boolean;
  isLoading: boolean;
  error: string | null;
}

// Wrapper that doesn't require passing createActor every time
export function useActor(): UseActorResult {
  // Call hooks unconditionally at the top level — never inside try/catch or after early returns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actorResult = useCaffeineActor(createActor as any);

  return useMemo(
    () => ({
      actor: (actorResult?.actor as BackendActor) ?? null,
      isFetching: actorResult?.isFetching ?? false,
      isLoading: actorResult?.isFetching ?? false,
      error: null,
    }),
    [actorResult?.actor, actorResult?.isFetching],
  );
}
