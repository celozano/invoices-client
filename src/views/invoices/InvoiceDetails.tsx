import clsx from 'clsx';
import { useParams } from 'react-router-dom';

import { CAR_FIELDS, CLIENT_FIELDS, SERVICE_FIELDS } from './constants';
import { useGetInvoice } from 'api/hooks/invoices';
import { Button } from 'components/Button';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { formatter } from 'utils';

export const InvoiceDetails = () => {
  const { invoice_number } = useParams();
  const { data: invoice, loading, error } = useGetInvoice(invoice_number!);

  if (error) {
    return (
      <div className='flex justify-center bg-red-50 p-4'>
        <h3 className='text-center text-sm font-medium text-red-800'>
          There was an unexpected error loading the data. Try again later.
        </h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex w-full items-center justify-center'>loading...</div>
    );
  }

  return (
    <div className='m-8'>
      <div className='flex flex-row-reverse print:hidden'>
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      <div className='mt-3 rounded-lg border border-gray-300 bg-white p-8 print:border-0 print:p-0'>
        <div className='space-y-3 divide-y divide-gray-200'>
          <Header
            invoiceNumber={invoice.invoice_number}
            createdAt={invoice.created_at}
            createdBy={invoice.created_by}
          />

          {/* client */}
          <div className='pt-3'>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 print:text-xs'>
              Client
            </h3>
            <div className='mt-2 grid grid-cols-12 gap-y-2 gap-x-4'>
              {CLIENT_FIELDS.map(({ id, label }) => (
                <div className='col-span-4' key={id}>
                  <span className='block text-sm text-gray-700 print:text-xs'>
                    {label}
                  </span>
                  <span className='block text-sm print:text-xs'>
                    {invoice.client[id]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* car */}
          <div className='pt-3'>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 print:text-xs'>
              Car
            </h3>
            <div className='mt-2 grid grid-cols-12 gap-y-2 gap-x-4'>
              {CAR_FIELDS.map(({ id, label }) => (
                <div className='col-span-4' key={id}>
                  <span className='block text-sm text-gray-700 print:text-xs'>
                    {label}
                  </span>
                  <span className='block text-sm print:text-xs'>
                    {invoice.car[id]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* items */}
          <div className='pt-3'>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 print:text-xs'>
              Items
            </h3>
            <div className='mt-2 grid grid-cols-12 gap-x-4'>
              {SERVICE_FIELDS.map(({ label }) => (
                <div
                  key={label}
                  className={clsx(
                    ' text-sm print:text-xs',
                    label === 'Description'
                      ? 'col-span-8'
                      : 'col-span-1 text-center'
                  )}
                >
                  <span>{label}</span>
                </div>
              ))}
            </div>
            {invoice.services.map((row: any, index: number) => (
              <div key={index} className='grid grid-cols-12 gap-4 py-1'>
                {SERVICE_FIELDS.map(({ id }, index: number) => (
                  <div
                    key={index}
                    className={clsx(
                      ' text-sm print:text-xs',
                      id === 'description'
                        ? 'col-span-8'
                        : 'col-span-1 text-center'
                    )}
                  >
                    <span className='text-right text-sm print:text-xs'>
                      {['rate', 'total'].find((item) => item === id)
                        ? formatter.format(row[id])
                        : id === 'tax_rate'
                        ? `${row[id]}%`
                        : row[id]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* totals */}
          <div className='pt-3 text-sm print:text-xs'>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Subtotal</span>
              <span className='col-start-4 text-right'>
                {formatter.format(invoice.subtotal)}
              </span>
            </div>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Tax</span>
              <span className='col-start-4 text-right'>
                {formatter.format(invoice.tax)}
              </span>
            </div>
          </div>

          <div className='pt-3 text-sm print:text-xs'>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Total</span>
              <span className='col-start-4 text-right'>
                {formatter.format(invoice.total)}
              </span>
            </div>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Amount Paid</span>
              <span className='col-start-4 text-right'>$0.00</span>
            </div>
          </div>

          <div className='pt-3 text-sm print:text-xs'>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Amount Due</span>
              <span className='col-start-4 text-right'>
                {formatter.format(invoice.total)}
              </span>
            </div>
          </div>

          <div className='pt-3'>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
