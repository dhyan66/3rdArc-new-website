import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="animate-fade-in-smooth">
      {children}
    </div>
  );
};

export default PageTransition;
