import * as React from 'react';
import { cn } from '../../lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('shrink-0 bg-gray-200 w-px h-full', className)}
        role="separator"
      />
    );
  }
  return (
    <hr
      className={cn('shrink-0 border-0 bg-gray-200 h-px w-full', className)}
      {...props}
    />
  );
}

export { Separator };
