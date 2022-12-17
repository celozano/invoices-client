export interface Service {
  description: string;
  quantity: number;
  rate: number;
  tax_rate: number;
  tax: number;
  total: number;
}

export interface Invoice {
  invoice_number: string;
  client: { first_name: string; last_name: string; phone: string };
  car: {
    brand: string;
    model: string;
    year: string;
    plates: string;
    engine: string;
    liter: string;
    start_mileage: string;
    end_mileage: string;
  };
  created_at: Date;
  services: Array<Service>;
  subtotal: number;
  tax: number;
  total: number;
  created_by: string;
}
