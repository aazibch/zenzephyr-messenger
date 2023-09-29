import { ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  styleType?: 'default' | 'primary' | 'danger';
}

const Button = ({
  styleType = 'default',
  className,
  children,
  ...props
}: ButtonProps) => {
  let textClass = '';
  let bgClass = '';
  let borderClass = '';

  if (styleType === 'default') {
    textClass = 'text-gray-600';
    bgClass = 'bg-white';
    borderClass = 'border-gray-300';
  }

  if (styleType === 'primary') {
    textClass = 'text-white';
    bgClass = 'bg-[#508778]';
    borderClass = 'border-[#508778]';
  }

  if (styleType === 'danger') {
    textClass = 'text-white';
    bgClass = 'bg-red-600';
    borderClass = 'border-red-600';
  }

  const classNames = `${bgClass} ${textClass} ${borderClass} font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border ${className}`;

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
