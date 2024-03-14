
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React, { FC, InputHTMLAttributes } from 'react';

const InputVariants = cva(
  
)

interface pageProps extends InputHTMLAttributes<HTMLInputElement> , VariantProps<typeof InputVariants> {
  
}

const Input: FC<pageProps> = ({className , type , value , name , onChange, children, placeholder, ...props}) => {
  return (
    <div className={cn(InputVariants({className}))}>
      <label htmlFor={name} className="block text-black">{children}</label>
      <input
        className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" 
        placeholder={placeholder}
        id={name}
        type={type}
        value={value}
        name={name}
        required
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default Input;