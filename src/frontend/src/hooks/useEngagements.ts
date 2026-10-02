/**
 * useEngagements — thin re-export from useQueries.
 */
export {
  useEngagements,
  useAddUpdateEngagement,
  useRemoveEngagement,
  useCloseOutEngagement,
  useDeliverables,
  useAddUpdateDeliverable,
  useRemoveDeliverable,
} from "@/hooks/useQueries";
export type { Engagement, Deliverable } from "@/hooks/useQueries";
