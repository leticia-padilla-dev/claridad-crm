import { useGetList } from "ra-core";
import type { CustomerEvent } from "../types";

export const useCustomerEvents = (
  contactId: string | number | undefined,
  { limit = 50 }: { limit?: number } = {},
) =>
  useGetList<CustomerEvent>(
    "customer_events",
    {
      pagination: { page: 1, perPage: limit },
      sort: { field: "occurred_at", order: "DESC" },
      filter: { contact_id: contactId },
    },
    { enabled: contactId != null },
  );
