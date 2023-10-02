import { ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  styleType?: 'default' | 'primary' | 'danger';
  isLoading?: boolean;
}

const Button = ({
  styleType = 'default',
  className,
  children,
  isLoading,
  ...props
}: ButtonProps) => {
  let styleSpecificClasses = '';

  if (styleType === 'default') {
    styleSpecificClasses =
      'text-gray-600 bg-white border-gray-300 hover:bg-[#e2e6ea] disabled:hover:bg-white';
  }

  if (styleType === 'primary') {
    styleSpecificClasses =
      'text-white bg-[#508778] border-[#508778] hover:bg-[#406c60] hover:border-[#406c60] disabled:hover:bg-[#508778] disabled:hover:border-[#508778]';
  }

  if (styleType === 'danger') {
    styleSpecificClasses =
      'text-white bg-red-600 border-red-600 hover:bg-[#b73131] hover:border-[#b73131] disabled:hover:bg-red-600 disabled:hover:border-red-600';
  }

  const classNames = `${styleSpecificClasses} font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border ${className}`;

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
