import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import CAR_LIST from 'data/car-list.json';
import { CAR_FIELDS, CLIENT_FIELDS, SERVICE_FIELDS } from './constants';
import { useCreateInvoice } from 'api/hooks/invoices';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Service } from 'types/invoice';
import { formatter } from 'utils';

const brands = CAR_LIST.map((item) => item.brand);
const defaultValues = {
  client: {
    first_name: '',
    last_name: '',
    phone: '',
  },
  car: {
    brand: '',
    model: '',
    year: '',
    plates: '',
    engine: '',
    liter: '',
    start_mileage: '',
    end_mileage: '',
  },
  services: [
    {
      description: '',
      quantity: 0,
      rate: 0,
      tax_rate: 0,
      tax: 0,
      total: 0,
    },
  ],
  subtotal: 0,
  tax: 0,
  total: 0,
};

export const CreateInvoice = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  watch(['subtotal', 'tax', 'total']);

  const selectedBrand = watch('car.brand');
  const models = useMemo(() => {
    return CAR_LIST.find((item) => item.brand === selectedBrand)?.models;
  }, [selectedBrand]);

  const { createInvoice, loading } = useCreateInvoice();

  const calculateGrandTotal = () => {
    const services = getValues('services');

    const subtotal = services.reduce((acc: number, curr: Service) => {
      return acc + curr.total;
    }, 0);
    const tax = services.reduce((acc: number, curr: Service) => {
      return acc + curr.tax;
    }, 0);
    const total = services.reduce((acc: number, curr: Service) => {
      return acc + (curr.total + curr.tax);
    }, 0);

    setValue('subtotal', subtotal);
    setValue('tax', tax);
    setValue('total', total);
  };

  const calculateServiceTotal = (index: number) => {
    const quantity = getValues(`services.${index}.quantity`);
    const rate = getValues(`services.${index}.rate`);
    const taxRate = getValues(`services.${index}.tax_rate`);

    const total = quantity * rate;
    setValue(`services.${index}.total`, total);

    if (taxRate && taxRate > 0) {
      const tax = total * (taxRate * 0.01);
      setValue(`services.${index}.tax`, tax);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await createInvoice({
        ...data,
        services: data.services.filter(
          (service: Service) => service.description && service.quantity
        ),
      });
      toast.success('Invoce created');

      const invoiceNumber = response.data.createInvoice.invoice_number;

      navigate(`/invoices/${invoiceNumber}`);
    } catch (error: any) {
      toast.error('An unknown error ocurred');
    }
  };

  return (
    <div className='m-8 rounded-lg border border-gray-300 bg-white p-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        {/* client */}
        <div className='space-y-5 divide-y divide-gray-200'>
          <div className='space-y-5 divide-y divide-gray-200'>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                Client
              </h3>
              <div className='grid grid-cols-12 gap-y-2 gap-x-4'>
                {CLIENT_FIELDS.map(({ id, label }) => (
                  <div className='col-span-4' key={id}>
                    <label className='block text-sm text-gray-700' htmlFor={id}>
                      {label}
                    </label>
                    <Input
                      id={id}
                      required
                      register={{ ...register(`client.${id}` as any) }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* car */}
            <div className='pt-3'>
              <div>
                <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                  Car
                </h3>
              </div>
              <div className='grid grid-cols-12 gap-y-2 gap-x-4'>
                <div className='col-span-4'>
                  <label className='block text-sm text-gray-700'>Brand</label>
                  <select
                    id={'car.brand'}
                    className='block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500'
                    {...register('car.brand', {
                      onChange: () => {
                        if (selectedBrand === 'Other') {
                          setValue('car.model', '');
                        }
                      },
                    })}
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-span-4'>
                  <label className='block text-sm text-gray-700'>Model</label>
                  {selectedBrand === 'Other' ? (
                    <Input id={'car.model'} {...register('car.model')} />
                  ) : (
                    <select
                      id={'car.model'}
                      className='block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500'
                      {...register('car.model')}
                    >
                      {models?.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {CAR_FIELDS.filter(
                  (field) => !['brand', 'model'].includes(field.id)
                ).map(({ id, label }) => (
                  <div className='col-span-4' key={id}>
                    <label className='block text-sm text-gray-700' htmlFor={id}>
                      {label}
                    </label>
                    <Input
                      id={`car.${id}`}
                      required
                      register={{ ...register(`car.${id}` as any) }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* services */}
            <div className='pt-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold leading-6 text-gray-900'>
                  Services
                </h3>
                <Button
                  className='bg-green-600 hover:bg-green-700 focus:ring-green-600'
                  onClick={(e) => {
                    e.preventDefault();

                    append({
                      description: '',
                      quantity: 0,
                      rate: 0,
                      tax_rate: 0,
                      tax: 0,
                      total: 0,
                    });
                  }}
                >
                  <PlusIcon className='h-5 w-5' />
                </Button>
              </div>
              <div className='grid grid-cols-12 gap-x-4'>
                {SERVICE_FIELDS.map((field) => field.label).map((label) => (
                  <div
                    key={label}
                    className={clsx(
                      'text-sm',
                      label === 'Description'
                        ? 'col-span-7 text-left'
                        : 'col-span-1 text-center'
                    )}
                  >
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              {fields.map((_, index) => (
                <div
                  key={index}
                  className='grid grid-cols-12 items-center gap-4 py-1'
                >
                  <div className='col-span-7'>
                    <Input
                      id={`services.${index}.description`}
                      register={{
                        ...register(`services.${index}.description`),
                      }}
                    />
                  </div>
                  <div className='col-span-1'>
                    <Input
                      id={`services.${index}.quantity`}
                      type='number'
                      register={{
                        ...register(`services.${index}.quantity`, {
                          valueAsNumber: true,
                          onChange: () => {
                            calculateServiceTotal(index);
                            calculateGrandTotal();
                          },
                        }),
                      }}
                    />
                  </div>
                  <div className='col-span-1'>
                    <Input
                      id={`services.${index}.rate`}
                      type='number'
                      min='0'
                      register={{
                        ...register(`services.${index}.rate`, {
                          valueAsNumber: true,
                          onChange: () => {
                            calculateServiceTotal(index);
                            calculateGrandTotal();
                          },
                        }),
                      }}
                    />
                  </div>
                  <div className='col-span-1'>
                    <Input
                      id={`services.${index}.tax_rate`}
                      type='number'
                      min='0'
                      step='0.5'
                      register={{
                        ...register(`services.${index}.tax_rate`, {
                          valueAsNumber: true,
                          onChange: () => {
                            calculateServiceTotal(index);
                            calculateGrandTotal();
                          },
                        }),
                      }}
                    />
                  </div>
                  <div className='col-span-1'>
                    <Input
                      id={`services.${index}.total`}
                      disabled
                      {...register(`services.${index}.total`)}
                    />
                  </div>
                  <div className='col-span-1 text-right'>
                    <Button
                      className='bg-red-500 text-right hover:bg-red-600 focus:ring-red-500'
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <TrashIcon className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='pt-3 text-sm print:text-xs'>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Subtotal</span>
              <span className='col-start-4 text-right'>
                {formatter.format(getValues('subtotal'))}
              </span>
            </div>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Tax</span>
              <span className='col-start-4 text-right'>
                {formatter.format(getValues('tax'))}
              </span>
            </div>
          </div>

          <div className='pt-3 text-sm print:text-xs'>
            <div className='grid grid-cols-4'>
              <span className='col-start-3'>Total</span>
              <span className='col-start-4 text-right'>
                {formatter.format(getValues('total'))}
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
                {formatter.format(getValues('total'))}
              </span>
            </div>
          </div>

          {/* save */}
          <div className='pt-3'>
            <div className='flex flex-row-reverse'>
              <Button disabled={loading} type='submit'>
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
