import { ReactNode } from 'react';

export interface H3Interface {
  element: 'h1' | 'p' | 'span'; // union type
  children: ReactNode;
}

export function H3({ element, children }: H3Interface) {
  switch (element) {
    case 'p':
      return (
        <p className='text-2xl font-semibold text-slate-900'>{children}</p>
      );
    case 'span': 
      return (
        <span className='text-2xl font-semibold text-slate-900'>{children}</span>
      );
    case 'h1': 
      return (
        <h1 className='text-2xl font-semibold text-slate-900'>{children}</h1>
      );
    default:
      return (
        <h3 className='text-2xl font-semibold text-slate-900'>{children}</h3>
      );
  }
}
