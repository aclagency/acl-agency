export type RenewalKind =
  | "road_tax"
  | "insurance"
  | "puspakom"
  | "permit";

export type RenewalStatus =
  | "pending"
  | "reminded"
  | "awaiting_reply"
  | "awaiting_payment"
  | "closed_won"
  | "closed_lost"
  | "bad_debt";

export interface Customer {
  id: string;
  company_name: string;
  tin_number: string | null;
  phone: string | null;
  pic_name: string | null;
  notes: string | null;
  blacklist: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  plate_no: string;
  trailer_no: string | null;
  vehicle_type: string | null;
  id_no: string | null;
  id_2: string | null;
  year_made: number | null;
  created_at: string;
  updated_at: string;
}

export interface Renewal {
  id: string;
  vehicle_id: string;
  kind: RenewalKind;
  due_date: string;
  status: RenewalStatus;
  ncd_percent: number | null;
  last_action_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  renewal_id: string;
  from_status: RenewalStatus | null;
  to_status: RenewalStatus | null;
  note: string | null;
  at: string;
}

type CustomerInsert =
  Omit<Customer, "id" | "created_at" | "updated_at">
  & Partial<Pick<Customer, "id">>;

type VehicleInsert =
  Omit<Vehicle, "id" | "created_at" | "updated_at">
  & Partial<Pick<Vehicle, "id">>;

type RenewalInsert =
  Omit<Renewal, "id" | "created_at" | "updated_at" | "last_action_at">
  & Partial<Pick<Renewal, "id" | "last_action_at">>;

type ActivityLogInsert =
  Omit<ActivityLogEntry, "id" | "at">
  & Partial<Pick<ActivityLogEntry, "id" | "at">>;

export interface Database {
  public: {
    Tables: {
      customers:    { Row: Customer;         Insert: CustomerInsert;    Update: Partial<Customer> };
      vehicles:     { Row: Vehicle;          Insert: VehicleInsert;     Update: Partial<Vehicle> };
      renewals:     { Row: Renewal;          Insert: RenewalInsert;     Update: Partial<Renewal> };
      activity_log: { Row: ActivityLogEntry; Insert: ActivityLogInsert; Update: Partial<ActivityLogEntry> };
    };
  };
}
