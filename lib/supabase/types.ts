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

export type OrderKind = "insurance" | "road_tax" | "puspakom" | "permit";
export type OrderStatus = "pending" | "done";

export interface IncomingOrder {
  id: string;
  created_at: string;
  company_name: string;
  plate_no: string;
  kind: OrderKind;
  pic_name: string | null;
  notes: string | null;
  status: OrderStatus;
  done_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      customers:    { Row: Customer;         Insert: Partial<Customer> & { company_name: string };    Update: Partial<Customer> };
      vehicles:     { Row: Vehicle;          Insert: Partial<Vehicle> & { customer_id: string; plate_no: string };     Update: Partial<Vehicle> };
      renewals:     { Row: Renewal;          Insert: Partial<Renewal> & { vehicle_id: string; kind: RenewalKind; due_date: string };     Update: Partial<Renewal> };
      activity_log: { Row: ActivityLogEntry; Insert: Partial<ActivityLogEntry> & { renewal_id: string }; Update: Partial<ActivityLogEntry> };
      incoming_orders: { Row: IncomingOrder; Insert: Partial<IncomingOrder> & { company_name: string; plate_no: string; kind: OrderKind }; Update: Partial<IncomingOrder> };
    };
  };
}
