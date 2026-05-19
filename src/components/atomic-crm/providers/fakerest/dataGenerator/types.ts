import type {
  Appointment,
  Company,
  Contact,
  ContactNote,
  CustomerEvent,
  Deal,
  DealNote,
  Sale,
  Tag,
  Task,
} from "../../../types";
import type { ConfigurationContextValue } from "../../../root/ConfigurationContext";

export interface Db {
  appointments: Appointment[];
  companies: Company[];
  contacts: Contact[];
  contact_notes: ContactNote[];
  customer_events: CustomerEvent[];
  deals: Deal[];
  deal_notes: DealNote[];
  sales: Sale[];
  tags: Tag[];
  tasks: Task[];
  configuration: Array<{ id: number; config: ConfigurationContextValue }>;
}
