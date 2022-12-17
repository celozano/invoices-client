interface Props {
  createdAt: string;
  createdBy: string;
  invoiceNumber: string;
}
export const Header = ({ createdAt, createdBy, invoiceNumber }: Props) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <img
            className='object-cover'
            src='/images/ase.jpeg'
            alt='ASE Certified'
          />
        </div>
        <div className='max-w-lg text-center'>
          <p className='font-semibold'>
            CALIFORNIA BRAKE AND LAMP CERTIFICATION
          </p>
          <p className='text-sm print:text-xs'>
            BY LAW YOU MAY CHOOSE ANOTHER FACILITY TO PERFORM ANY NEEDED REPAIRS
            OR ADJUSTMENTS WHICH THE SMOG TEST INDICATES ARE NECESSARY.
          </p>
        </div>
        <div>
          <img
            src='/images/smog-check.jpeg'
            alt='Smog Check - State of California Licensed'
          />
        </div>
      </div>
      <div className='mt-2 flex justify-between'>
        <div className='text-sm print:text-xs'>
          <p className='font-semibold'>SERGIO'S Auto Repair</p>
          <p>Computer Diagnosis</p>
          <p>1503 N Magnolia Av., El Cajon, CA, 92020</p>
          <p>Phone: (619) 440-7081</p>
          <p>
            WARNING: We assume no liability for loss or injury to customer
            entering the work area.
          </p>
        </div>
        <div className='text-right text-sm print:text-xs'>
          <p className='font-semibold'>Invoice No. {invoiceNumber}</p>
          <p>{new Date(createdAt).toLocaleDateString('en-us')}</p>
          <p>Created by: {createdBy}</p>
        </div>
      </div>
    </div>
  );
};
