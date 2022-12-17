import { gql } from '@apollo/client';

export const INVOICE_QUERY = gql`
  query GetInvoice($invoice_number: Float!) {
    getInvoice(invoice_number: $invoice_number) {
      invoice_number
      client {
        first_name
        last_name
        phone
      }
      car {
        brand
        model
        year
        plates
        engine
        liter
        start_mileage
        end_mileage
      }
      created_at
      created_by
      services {
        description
        quantity
        rate
        tax_rate
        total
      }
      subtotal
      tax
      total
    }
  }
`;

export const INVOICES_QUERY = gql`
  query GetInvoices {
    getInvoices {
      invoice_number
      client {
        first_name
      }
      total
      created_at
      created_by
    }
  }
`;

export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($data: InvoiceInput!) {
    createInvoice(data: $data) {
      invoice_number
      client {
        first_name
        last_name
      }
      created_at
      created_by
      total
    }
  }
`;
