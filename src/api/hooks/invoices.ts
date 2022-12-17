import { useMutation, useQuery } from '@apollo/client';

import {
  CREATE_INVOICE_MUTATION,
  INVOICES_QUERY,
  INVOICE_QUERY,
} from '../queries/invoices';
import { Invoice } from '../../types/invoice';

export const useGetInvoice = (invoice_number: string) => {
  const { data, ...rest } = useQuery(INVOICE_QUERY, {
    variables: { invoice_number: Number(invoice_number) },
  });

  return {
    data: data?.getInvoice,
    ...rest,
  };
};

export const useGetInvoices = () => {
  const { data, ...rest } = useQuery(INVOICES_QUERY);

  return {
    data: data?.getInvoices,
    ...rest,
  };
};

export const useCreateInvoice = () => {
  const [createInvoice, rest] = useMutation(CREATE_INVOICE_MUTATION, {
    update(cache, { data }) {
      const { getInvoices } = cache.readQuery({
        query: INVOICES_QUERY,
      }) as any;

      cache.writeQuery({
        query: INVOICES_QUERY,
        data: {
          getInvoices: [...getInvoices, data.createInvoice],
        },
      });
    },
  });

  return {
    createInvoice: (data: Invoice) => {
      const variables = {
        data,
      };

      return createInvoice({ variables });
    },
    ...rest,
  };
};
