/**
 * useClients — thin re-export from useQueries.
 */
export {
  useClients,
  useAddUpdateClient,
  useRemoveClient,
  useClientsByEngagement,
  useContactsByClient,
  useInvoicesByClient,
  useNotesByClient,
} from "@/hooks/useQueries";
export type { Client } from "@/hooks/useQueries";
