import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { useGetInvoices } from 'api/hooks/invoices';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { Invoice } from 'types/invoice';
import { formatter } from 'utils';

export const Invoices = () => {
  const navigate = useNavigate();

  const { data: invoices, loading, error } = useGetInvoices();

  const columns = useMemo(() => {
    return [
      { accessorKey: 'invoice_number', header: 'Invoice No.' },
      {
        accessorFn: (row: Invoice) => row.client.first_name,
        header: 'Client Name',
      },
      {
        accessorFn: (row: Invoice) => formatter.format(row.total),
        header: 'Amount',
      },
      {
        accessorFn: (row: Invoice) =>
          new Date(row.created_at).toLocaleDateString('en-US'),
        header: 'Date',
      },
    ];
  }, []);

  const table = useReactTable({
    data: invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
    <div className='p-8'>
      <div className='flex flex-row-reverse'>
        <div>
          <Button onClick={() => navigate('/invoices/create')}>
            Create New
          </Button>
        </div>
      </div>
      <div className='mt-3'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full py-2 align-middle'>
            <div className='overflow-hidden rounded-lg border border-gray-300'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className='hover:cursor-pointer'
                        onClick={() =>
                          navigate(`/invoices/${row.original.invoice_number}`)
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className='whitespace-nowrap py-4 pl-3 text-left text-sm font-medium text-gray-900'
                          >
                            <>{cell.getValue()}</>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className='h-2' />
            <div className='flex items-center justify-between rounded-md border border-gray-300 bg-white p-2'>
              <div className='flex gap-2'>
                <span className='flex items-center gap-1'>
                  <div>Page</div>
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </strong>
                </span>
                <span className='flex items-center gap-1'>
                  | Go to page:
                  <Input
                    className='w-16'
                    type='number'
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                  />
                </span>
                <select
                  className='rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500'
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex gap-2'>
                <button
                  className='w-16 rounded border border-gray-300 p-1'
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </button>
                <button
                  className='w-16 rounded border border-gray-300 p-1'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </button>
                <button
                  className='w-16 rounded border border-gray-300 p-1'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </button>
                <button
                  className='w-16 rounded border border-gray-300 p-1'
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
