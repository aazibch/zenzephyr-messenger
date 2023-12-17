import { ComponentPropsWithoutRef } from 'react';

interface InputProps {
  className?: string;
  input: ComponentPropsWithoutRef<'input'>;
  label?: string;
}

const Input = ({ className, input, label }: InputProps) => {
  return (
    <div className={`${className} mb-4`}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label className="block" htmlFor={input.id}>
            {label}
          </label>
        </div>
      )}

      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-2 mb-1"
        {...input}
      />
    </div>
  );
};

export default Input;
