import clsx from 'clsx';
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register?: any;
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { className, type = 'text', disabled, register = {}, ...rest },
  ref
) => {
  return (
    <input
      className={clsx(
        'block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500',
        disabled ? 'bg-gray-100' : '',
        className
      )}
      type={type}
      ref={ref}
      {...rest}
      {...register}
    />
  );
};

export const Input = forwardRef(InputComponent);
