import { Link } from 'react-router-dom';

export const InvoiceLayout = ({ children }: { children: any }) => {
  return (
    <>
      <div className='min-h-full'>
        <nav className='bg-black print:hidden'>
          <div className='mx-auto max-w-7xl px-8'>
            <div className='flex h-16 items-center justify-between'>
              <Link
                to='/invoices'
                className='text-base font-semibold text-white'
              >
                Invoices
              </Link>
              <Link className='text-sm font-normal text-white' to='/logout'>
                Logout
              </Link>
            </div>
          </div>
        </nav>

        <main>
          <div className='mx-auto max-w-7xl'>
            <div>{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};
