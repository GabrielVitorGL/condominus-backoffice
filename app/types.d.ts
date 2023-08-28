export interface User {
  id: string;
  email: string;
  nome: string;
}

export interface Morador {
  nome: string;
  cpf: string;
  telefone: string;
}

export interface Sindico {
  cpf: string;
  nome: string;
  telefone: string;
}

export interface Apartamento {
  telefone: string;
  numero: string;
}

export interface AreaComum {
  nome: string;
  capacidade: number;
}

export interface Reserva {
  data_reserva: string;
}

export interface Entrega {
  remetente: string;
  data_entrega: string;
  data_retirada: string;
}

export interface Condominio {
  nome_condominio: string;
  endereco: string;
}

export interface UsuarioMorador {
  nome: string;
  email: string;
}






















export interface BankAccount {
  id: string;
  bank_account_number: string;
  bank_account_type: string;
  bank_agency: string;
  bank_code: string;
  bank_name: string;
  owner_document: string;
  owner_name: string;
  status: string;
}

interface InvoiceFile {
  url: string;
  filename: string;
  status: string;
  upload_date: string;
}

export interface Payable {
  id: string;
  amount: number;
  expiration_date: string;
  installment: number;
  installment_total: number;
  invoice_files: InvoiceFile[];
  invoice_issue_date: string;
  invoice_key: string;
  invoice_net_amount: number;
  invoice_number: string;
  invoice_type: string;
  sponsor_document: string;
  sponsor_name: string;
  status: string;
  supplier_document: string;
  supplier_name: string;
}

export interface SoldPayable {
  id: string;
  amount: number;
  expiration_date: string; // date
  external_id: string;
  installment: number;
  installment_total: integer;
  invoice_files: InvoiceFile[];
  invoice_issue_date: string; // date
  invoice_key?: string;
  invoice_net_amount: number;
  invoice_number: string;
  invoice_type: "NFe" | "NFSe" | "RPA" | "Others";
  lender_bank_account_digit: string;
  lender_bank_account_number: string;
  lender_bank_agency: string;
  lender_bank_code: string;
  lender_bank_name: string;
  lender_document: string;
  lender_name: string;
  liquidated_at: string; // date
  sold_amount: number;
  sold_date: string; // date
  sponsor_name: string;
  status: string;
  supplier_document: string;
  supplier_name: string;
  tax_amount: number;
}

export interface AdditionalCost {
  description: string;
  label: string;
  quantity: number;
  total_amount: number;
  type: string;
  unit_amount: number;
}

interface SimulationAsset {
  amount: number;
  days_to_advance: number;
  expected_liquidation_date: string;
  expiration_date: string;
  final_amount: number;
  installment: number;
  installment_total: number;
  invoice_number: string;
  tax_amount: number;
  tax_perc: number;
}

interface Simulation {
  additional_costs: AdditionalCost[];
  additional_costs_amount: number;
  advancement_term_link: string;
  amount: number;
  assets: SimulationAsset[];
  base_date: string;
  created_at: string;
  final_amount: number;
  id: string;
  lender_document: string;
  lender_name: string;
  status: string;
  supplier_document: string;
  supplier_name: string;
  sponsor_document: string;
  sponsor_name: string;
  tax_amount: number;
  tax_perc_avg: number;
}

export interface Advancement {
  additional_costs: AdditionalCost[];
  additional_costs_amount: number;
  advancement_term_link: string;
  amount: number;
  bank_account_number: string;
  bank_account_type: string;
  bank_agency: string;
  bank_code: string;
  bank_name: string;
  bank_owner_document: string;
  bank_owner_name: string;
  created_at: string;
  final_amount: number;
  id: string;
  lender_document: string;
  lender_name: string;
  scheduled_date: string;
  status: string;
  supplier_document: string;
  supplier_name: string;
  tax_amount: number;
  updated_at: string;
}

export interface Pagination {
  current_entries_size: number;
  offset: number;
  page: number;
  per_page: number;
  total_entries_size: number;
  total_pages: number;
}
