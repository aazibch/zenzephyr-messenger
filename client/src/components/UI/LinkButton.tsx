import { Link, LinkProps } from 'react-router-dom';

interface LinkButtonProps extends LinkProps {
  styleType?: 'default' | 'primary' | 'danger';
}

const LinkButton = ({
  styleType = 'default',
  className,
  children,
  ...props
}: LinkButtonProps) => {
  let textClass = '';
  let bgClass = '';
  let borderClass = '';
  let hoverBgClass = '';
  let hoverBorderClass = '';

  if (styleType === 'default') {
    textClass = 'text-gray-600';
    bgClass = 'bg-white';
    borderClass = 'border-gray-300';
    hoverBgClass = 'hover:bg-[#e2e6ea]';
  }

  if (styleType === 'primary') {
    textClass = 'text-white';
    bgClass = 'bg-[#508778]';
    borderClass = 'border-[#508778]';
    hoverBgClass = 'hover:bg-[#406c60]';
    hoverBorderClass = 'hover:border-[#406c60]';
  }

  if (styleType === 'danger') {
    textClass = 'text-white';
    bgClass = 'bg-red-600';
    borderClass = 'border-red-600';
    hoverBgClass = 'hover:bg-[#b73131]';
    hoverBorderClass = 'hover:border-[#b73131]';
  }

  const classNames = `${bgClass} ${textClass} ${borderClass} ${hoverBgClass} ${hoverBorderClass} font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border ${className}`;

  return (
    <Link className={classNames} {...props}>
      {children}
    </Link>
  );
};

export default LinkButton;
