import clsx from 'clsx';
import { MouseEvent, ReactElement } from 'react';

interface Props {
  className?: string;
  children: ReactElement | string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
  className,
  children,
  disabled = false,
  type = 'button',
  onClick,
}: Props) => {
  return (
    <button
      className={clsx(
        'rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        disabled && 'opacity-50',
        className
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
